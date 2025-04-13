import type { Meta, StoryObj } from "@storybook/react";
import { VideoPostCard } from "./VideoPostCard";

const meta: Meta<typeof VideoPostCard> = {
  title: "Components/Video/VideoPostCard",
  component: VideoPostCard,
  tags: ["autodocs"],
  args: {
    id: "1",
    title: "How to Make Perfect Pizza Dough",
    description: "Learn the secrets to making restaurant-quality pizza dough at home with this step-by-step guide.",
    videoUrl: "https://example.com/videos/pizza-dough.mp4", // Replace with actual video URL
    thumbnailUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    duration: 385, // 6:25 in seconds
  },
  parameters: {
    layout: 'fullscreen', // Needed to demonstrate mini player
    docs: {
      story: {
        height: '800px', // Give enough room to scroll
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VideoPostCard>;

export const Default: Story = {};

export const WithAutoplay: Story = {
  args: {
    autoplay: {
      enabled: true,
      muted: true,
    },
  },
};

export const AutoplayWhenVisible: Story = {
  args: {
    autoplay: {
      enabled: true,
      muted: true,
      onlyWhenVisible: true,
    },
  },
};

export const CustomPlaybackRate: Story = {
  args: {
    autoplay: {
      enabled: true,
      muted: true,
      playbackRate: 1.5,
    },
    title: "Pizza Making Tutorial (1.5x Speed)",
  },
};

export const WithMiniPlayer: Story = {
  args: {
    enableMiniPlayer: true,
    autoplay: {
      enabled: true,
      muted: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Start playing the video and scroll down to see the mini player appear.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '200vh', paddingTop: '20px' }}>
        <Story />
        <div style={{ marginTop: '100vh' }}>
          Scroll up to see the mini player
        </div>
      </div>
    ),
  ],
};

export const WithoutMiniPlayer: Story = {
  args: {
    enableMiniPlayer: false,
  },
};

export const NoDescription: Story = {
  args: {
    description: undefined,
  },
};

export const LongTitle: Story = {
  args: {
    title: "Ultimate Guide to Making the Perfect Neapolitan Pizza Dough from Scratch with Professional Tips and Techniques",
  },
};

export const ShortVideo: Story = {
  args: {
    duration: 45, // 0:45 in seconds
    title: "Quick Pizza Sauce Recipe",
    description: "A 45-second guide to making the perfect pizza sauce.",
  },
};

export const LongVideo: Story = {
  args: {
    duration: 3600, // 1:00:00 in seconds
    title: "Complete Pizza Making Masterclass",
    description: "A comprehensive guide to making pizza from start to finish.",
  },
};

export const WithCallbacks: Story = {
  args: {
    onPlay: () => console.log("Video started playing"),
    onPause: () => console.log("Video paused"),
    onEnded: () => console.log("Video ended"),
  },
};
