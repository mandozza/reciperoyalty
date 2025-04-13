import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  SkipBack,
  SkipForward,
  Minimize2,
  X,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getOptimalQuality,
  preloadVideoMetadata,
  calculateBufferSize,
  VideoQualityLevel,
  QUALITY_LEVELS,
} from "@/lib/video-optimization";

interface AutoplayOptions {
  enabled: boolean;
  muted?: boolean;
  onlyWhenVisible?: boolean;
  playbackRate?: number;
}

interface VideoPostCardProps {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  autoplay?: AutoplayOptions;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  enableMiniPlayer?: boolean;
  qualities?: VideoQualityLevel[];
}

/**
 * VideoPostCard component for displaying video content with custom controls, mini player support,
 * and adaptive quality based on network conditions
 */
export function VideoPostCard({
  id,
  title,
  description,
  videoUrl,
  thumbnailUrl,
  duration,
  autoplay = { enabled: false },
  className,
  onPlay,
  onPause,
  onEnded,
  enableMiniPlayer = true,
  qualities = QUALITY_LEVELS,
}: VideoPostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(autoplay?.muted ?? false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<VideoQualityLevel>(qualities[1]); // Start with 720p
  const [isBuffering, setIsBuffering] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<IntersectionObserver>();

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        onPause?.();
      } else {
        videoRef.current.play().catch(() => {
          // Handle autoplay blocking
          setIsMuted(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        });
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (videoRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Initialize video optimization
  useEffect(() => {
    const initVideo = async () => {
      try {
        // Preload video metadata
        await preloadVideoMetadata(videoUrl);

        // Set optimal quality based on network and screen
        const optimalQuality = await getOptimalQuality();
        setCurrentQuality(optimalQuality);

        // Set buffer size based on network
        if (videoRef.current) {
          const bufferSize = calculateBufferSize();
          videoRef.current.preload = "auto";
          // @ts-ignore - buffered property exists on HTMLMediaElement
          videoRef.current.bufferSize = bufferSize;
        }
      } catch (error) {
        console.error("Error initializing video:", error);
      }
    };

    initVideo();
  }, [videoUrl]);

  // Handle quality change
  const handleQualityChange = (quality: VideoQualityLevel) => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;

      setCurrentQuality(quality);
      setShowQualityMenu(false);

      // Resume playback at the same position
      videoRef.current.currentTime = currentTime;
      if (wasPlaying) {
        videoRef.current.play();
      }
    }
  };

  // Handle buffering
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  // Handle visibility-based autoplay
  useEffect(() => {
    if (!autoplay?.enabled || !autoplay?.onlyWhenVisible) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting && videoRef.current) {
          togglePlay();
        } else if (!entry.isIntersecting && videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
          onPause?.();
        }
      },
      {
        threshold: 0.5, // 50% visibility required
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [autoplay?.enabled, autoplay?.onlyWhenVisible]);

  // Handle initial autoplay
  useEffect(() => {
    if (!autoplay?.enabled || (autoplay?.onlyWhenVisible && !isVisible)) return;

    const attemptAutoplay = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          onPlay?.();
        } catch (error) {
          // If autoplay is blocked, try with muted audio
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            try {
              await videoRef.current.play();
              setIsPlaying(true);
              onPlay?.();
            } catch (mutedError) {
              console.warn("Autoplay failed even with muted audio");
            }
          }
        }
      }
    };

    attemptAutoplay();
  }, [autoplay?.enabled, isVisible]);

  // Update time display
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [onEnded]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  // Handle mini player toggle
  const toggleMiniPlayer = () => {
    if (!enableMiniPlayer) return;
    setIsMiniPlayer(!isMiniPlayer);
  };

  // Handle scroll for mini player
  useEffect(() => {
    if (!enableMiniPlayer) return;

    const handleScroll = () => {
      if (!containerRef.current || isFullscreen) return;

      const rect = containerRef.current.getBoundingClientRect();
      const shouldShowMiniPlayer = rect.bottom < 0 && isPlaying;

      if (shouldShowMiniPlayer !== isMiniPlayer) {
        setIsMiniPlayer(shouldShowMiniPlayer);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableMiniPlayer, isPlaying, isMiniPlayer, isFullscreen]);

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden",
          isMiniPlayer && "fixed bottom-4 right-4 w-80 z-50 shadow-xl",
          className
        )}
        ref={containerRef}
        onMouseMove={() => {
          setShowControls(true);
          if (isPlaying) {
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
            }
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
          }
        }}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <CardHeader className={cn(
          "p-0 relative aspect-video",
          isMiniPlayer && "aspect-video"
        )}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={thumbnailUrl}
            onClick={togglePlay}
            muted={isMuted}
            playsInline
          >
            <source
              src={`${videoUrl}?quality=${currentQuality.height}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Loading Spinner */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <Play className="w-16 h-16 text-white" />
            </div>
          )}

          {/* Video Controls */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4",
              "transition-opacity duration-300",
              (!showControls && isPlaying) && "opacity-0"
            )}
          >
            {/* Progress Bar */}
            <Slider
              value={[currentTime ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              className="mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {enableMiniPlayer && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80"
                    onClick={toggleMiniPlayer}
                  >
                    {isMiniPlayer ? (
                      <Maximize2 className="h-6 w-6" />
                    ) : (
                      <Minimize2 className="h-6 w-6" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quality Settings Button */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white/80"
              onClick={() => setShowQualityMenu(!showQualityMenu)}
            >
              <Settings className="h-5 w-5" />
            </Button>

            {/* Quality Menu */}
            {showQualityMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-black/90 rounded-md shadow-lg">
                {qualities.map((quality) => (
                  <button
                    key={quality.label}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left text-white hover:bg-white/10",
                      quality.height === currentQuality.height && "bg-white/20"
                    )}
                    onClick={() => handleQualityChange(quality)}
                  >
                    {quality.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mini Player Close Button */}
          {isMiniPlayer && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:text-white/80"
              onClick={() => {
                setIsMiniPlayer(false);
                if (isPlaying) {
                  videoRef.current?.pause();
                  setIsPlaying(false);
                  onPause?.();
                }
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>

        {(!isMiniPlayer || !isPlaying) && (
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </CardContent>
        )}
      </Card>
    </>
  );
}
