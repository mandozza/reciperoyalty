/**
 * Video optimization utilities for handling video playback and loading
 */

export interface VideoQualityLevel {
  width: number;
  height: number;
  bitrate: number;
  label: string;
}

export const QUALITY_LEVELS: VideoQualityLevel[] = [
  { width: 1920, height: 1080, bitrate: 6000000, label: '1080p' },
  { width: 1280, height: 720, bitrate: 3000000, label: '720p' },
  { width: 854, height: 480, bitrate: 1500000, label: '480p' },
  { width: 640, height: 360, bitrate: 800000, label: '360p' },
];

/**
 * Determines the optimal video quality based on network conditions and screen size
 */
export async function getOptimalQuality(): Promise<VideoQualityLevel> {
  // Check network conditions using Navigator API
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';
  const downlink = connection?.downlink || 10; // Mbps

  // Get device pixel ratio and screen size
  const dpr = window.devicePixelRatio || 1;
  const screenWidth = window.innerWidth * dpr;

  // Calculate optimal quality based on network and screen
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 0.5) {
    return QUALITY_LEVELS[3]; // 360p
  } else if (effectiveType === '3g' || downlink < 2) {
    return QUALITY_LEVELS[2]; // 480p
  } else if (screenWidth <= 1280 || downlink < 5) {
    return QUALITY_LEVELS[1]; // 720p
  }

  return QUALITY_LEVELS[0]; // 1080p
}

/**
 * Preloads video metadata for faster playback
 */
export function preloadVideoMetadata(videoUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoUrl;

    video.onloadedmetadata = () => {
      video.remove();
      resolve();
    };

    video.onerror = (error) => {
      video.remove();
      reject(error);
    };
  });
}

/**
 * Checks if the browser supports a specific video codec
 */
export function checkCodecSupport(codec: string): boolean {
  const video = document.createElement('video');
  return video.canPlayType(codec) !== '';
}

/**
 * Gets the supported video format for the current browser
 */
export function getSupportedVideoFormat(): string {
  const formats = [
    { type: 'video/mp4; codecs="avc1.42E01E"', ext: 'mp4' },
    { type: 'video/webm; codecs="vp9"', ext: 'webm' },
    { type: 'video/webm; codecs="vp8"', ext: 'webm' },
  ];

  for (const format of formats) {
    if (checkCodecSupport(format.type)) {
      return format.ext;
    }
  }

  return 'mp4'; // Fallback to MP4
}

/**
 * Generates a video thumbnail at a specific time
 */
export function generateThumbnail(
  videoUrl: string,
  time: number = 0
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    video.crossOrigin = 'anonymous';
    video.src = videoUrl;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.onseeked = () => {
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          video.remove();
          canvas.remove();
          resolve(thumbnail);
        } catch (error) {
          reject(error);
        }
      }
    };

    video.onerror = (error) => {
      video.remove();
      canvas.remove();
      reject(error);
    };

    video.currentTime = time;
  });
}

/**
 * Calculates optimal buffer size based on network conditions
 */
export function calculateBufferSize(): number {
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';

  // Buffer size in seconds
  switch (effectiveType) {
    case 'slow-2g':
      return 30;
    case '2g':
      return 20;
    case '3g':
      return 15;
    default:
      return 10;
  }
}
