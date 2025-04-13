# 🧩 Component Guide – Social Cooking Platform

---

## 🔹 1. Navigation Components

### `BottomNavBar` (Mobile)
- Tabs: Home, Explore, Add, Plan, Profile
- Icon + label combo
- Highlights current tab with color or underline

### `SidebarNav` (Desktop)
- Vertical list with icons and labels
- Expandable/collapsible
- Shows active state

---

## 🔹 2. Feed & Card Components

### `RecipeCard`
- Hero image
- Title
- Tags (difficulty, cuisine, etc.)
- Short description
- Like / Comment / Share buttons
- Optional: Save to Cookbook button

### `VideoPostCard`
- Video thumbnail with play icon
- User avatar + name
- Title / description
- Reactions + comments inline

### `ActivityCard`
- “User X saved Y” or “Posted new recipe”
- Small preview image + text
- Timestamp

---

## 🔹 3. User Components

### `UserAvatar`
- Image (with fallback initials)
- Optional status indicator (online/posting)

### `UserProfileHeader`
- Avatar, name, bio
- Follow / Message / Share buttons
- Tabs for Recipes, Cookbooks, Activity

### `FollowButton`
- Dynamic state (Follow / Following)
- Optional: with follower count

---

## 🔹 4. Creation & Form Components

### `RecipeForm`
- Step-by-step form sections:
  - Title
  - Hero image or video upload
  - Ingredients (repeating fields)
  - Steps (with image or video per step)
  - Tags (cuisine, diet, cook time)
- Save draft / Publish options

### `PostVideoHackForm`
- Upload video
- Caption
- Optional tags (kitchen tips, gear, ingredients)

### `AIHelperModal`
- Prompt input field
- Suggested prompts (e.g., "I have chicken, rice, broccoli")
- Generated recipe preview
- Insert to recipe planner or save draft

---

## 🔹 5. Explore & Discovery Components

### `SearchBar`
- Keyword input
- Tag dropdowns
- Optional voice search icon
- Autosuggest or recent searches

### `TrendingCarousel`
- Horizontally scrollable recipe/image cards
- Could include featured cooks or collections

### `TagPill`
- Clickable button (e.g., "Gluten-Free", "30 Minutes")
- Filter view when selected
- Used throughout app

---

## 🔹 6. Meal Planning Components

### `MealPlannerCalendar`
- Weekly grid layout
- Drag-and-drop support for recipes
- Click to add slot: opens recipe picker

### `GroceryList`
- Checklist of ingredients
- Grouped by type (produce, meat, pantry)
- Export / Print option

---

## 🔹 7. Interaction Components

### `ReactionBar`
- Emoji reactions (❤️ 😋 🔥 etc.)
- Tap to toggle / view counts

### `CommentThread`
- Avatar + name + timestamp
- Threaded replies
- Like / Report / Reply buttons

### `NotificationToast`
- Brief confirmation ("Recipe saved!")
- Appears top-right or bottom center
- Auto-dismiss after a few seconds

---

## 🔹 8. Cookbook Components

### `CookbookShelf`
- Grid or list of saved collections
- Each shows:
  - Cover image
  - Title
  - # of recipes
  - Last updated

### `CreateCookbookModal`
- Name + optional cover image
- Add recipes via search or existing favorites
- Drag to reorder within cookbook

---

## 🔹 9. System & Utility Components

### `Modal`
- Used for creation flows, AI helper, alerts
- Click outside or close button to dismiss

### `Button`
- Primary, Secondary, Icon-only
- States: hover, focus, disabled, loading

### `FormInput`
- Text, textarea, dropdown, file upload, checkbox
- Consistent styling across app

### `LoadingSkeleton`
- Placeholder cards used during data fetch

---

## 🔹 10. Admin/Moderation Components (Optional)

### `ReportContentModal`
- Dropdown for report reason
- Optional comments
- Send to moderation dashboard

### `ContentFlagBadge`
- Icon indicating flagged content (visible to moderators only)

