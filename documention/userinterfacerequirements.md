# 🧑‍🍳 User Interface Design Document – Social Cooking Platform

## Layout Structure

- **Mobile-First, Feed-Centric Layout**
  - Bottom Navigation Bar with 5 main tabs:  
    - Home (Feed)  
    - Explore  
    - Add (Recipe/Video Post)  
    - Meal Planner  
    - Profile

- **Web/Desktop Layout**
  - Left Sidebar Navigation with matching tabs
  - Responsive content area with card layout
  - Sticky top bar for search and quick actions

## Core Components

- **Feed (Home)**
  - Scrollable vertical feed of cards with:
    - Hero image
    - Title, tags, reactions
    - Short intro or tip
    - Like, comment, share buttons
  - Mixed content: Recipes, quick video tips, meal updates

- **Explore**
  - Grid layout of trending recipes, featured users, ingredient tags
  - Filters by cuisine, time, diet, popularity
  - Search bar with auto-suggestions

- **Create Recipe / Post**
  - Modal or full-screen flow:
    - Choose content type (Recipe or Hack/Video)
    - Add media, steps, tags, and notes
    - Publish and preview

- **Meal Planner**
  - Drag-and-drop calendar interface
  - Add recipes directly from favorites or feed
  - Auto-generate grocery list

- **Profile**
  - Avatar, bio, location (optional)
  - Recipe library and digital cookbooks
  - Followers / Following count
  - Activity overview

## Interaction Patterns

- Tap to expand cards (mobile) or hover preview (desktop)
- Swipe interactions on mobile (e.g., save, like)
- Modal overlays for quick AI helper access or create flows
- Smooth transitions between tabs and sections
- In-line reactions, emoji, and mentions in comments

## Visual Design Elements & Color Scheme

- **Color Palette**
  - Neutral base (light gray/white)
  - Accent colors for reactions (e.g., red for ❤️, green for ✅)
  - Light/Dark mode toggle
  - Subtle shadows and rounded corners on cards

- **Visual Style**
  - Card-based design with emphasis on imagery
  - Full-bleed recipe images for immersive experience
  - Icons with soft edges and clarity

## Mobile, Web App, Desktop Considerations

- **Mobile Web:**
  - Bottom tab nav
  - Large tap targets
  - One-column layout
  - Swipe and gesture support

- **Desktop Web:**
  - Multi-column feed layout
  - Sidebar nav for fast switching
  - Hover-based previews
  - Drag-and-drop meal planner enhanced

## Typography

- **Font Style:** Rounded, friendly sans-serif (e.g., Inter, Nunito)
- **Font Sizes:**
  - Headings: Large and bold for contrast
  - Body: Clear and legible (~16px)
  - Labels/Tags: Slightly smaller with color accents

## Accessibility

- High color contrast for readability
- ARIA labels for screen reader support
- Keyboard navigable components
- Alt text required for all uploaded media
- Motion and animation kept subtle with user preference toggle

