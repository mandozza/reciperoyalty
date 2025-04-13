# 🍳 Social Cooking Platform – Product Requirements Document

## 1. Elevator Pitch
A social platform built entirely around the love of cooking — this app blends the practicality of a recipe manager with the personality of a social network. Home cooks can discover and share recipes, post cooking videos and kitchen hacks, build personalized meal plans, create digital cookbooks, and connect with a vibrant community of food lovers. It’s part cookbook, part social network — all about making cooking more fun, interactive, and personal.

## 2. Who Is This App For
- Primary audience: Home cooks aged 25–40
- Users who are learning to cook and want guidance, inspiration, and community
- People interested in organizing, sharing, and discovering new recipes
- Socially motivated users who enjoy commenting, liking, and following others
- Users who prefer a web-first experience (desktop & mobile web)

## 3. Functional Requirements – What It Does
### Core Features
- Recipe CRUD: Create, edit, delete, and view recipes with media support (photos/videos)
- Categorization: Recipes tagged by cuisine, diet, difficulty, cook time, ingredients
- Explore & Search: Filter by tags, ingredients, popularity, or dietary needs
- Save Favorites: Mark and revisit liked recipes
- Meal Planning: Drag-and-drop meal planner with calendar view
- Grocery List: Auto-generated shopping list based on selected recipes
- Digital Cookbooks: Curate personal collections of favorite recipes

### Social Features
- User Profiles: Personal bio, avatar, recipes shared, and cookbooks
- Activity Feed: What your network is posting, cooking, and saving
- Reactions & Comments: Engage on recipes, tips, and media posts
- Follow System: Follow other cooks and creators
- Video Posts & Kitchen Hacks: Share more than just recipes

### AI Features
- AI Recipe Generator: Suggest recipes based on ingredients input (via OpenAI)
- Recipe Summarizer: Generate short step-by-step walkthroughs
- Future: Voice-based navigation or smart meal suggestions

### Account & Moderation
- Signup/Login: Email and Gmail (OAuth)
- Moderation Tools: Report content, flag abusive behavior, admin dashboard

### Monetization (Planned)
- Tip jar for creators
- Paid premium cookbooks
- Featured spots or sponsored posts

## 4. User Stories – How Users Will Interact

- As a user, I can create an account with my email or Google login
- As a user, I can create and share a recipe with images and tags
- As a user, I can follow other users and like or comment on their recipes
- As a user, I can plan my meals for the week using a calendar
- As a user, I can save recipes into custom digital cookbooks
- As a user, I can generate recipes based on what I have in my fridge
- As a user, I can view trending and recommended recipes in an Explore tab
- As a user, I can report content that is inappropriate or offensive
- As a user, I can receive suggestions from AI based on my preferences

## 5. User Interface – How It Will Look

### General Design
- Clean, modern interface with a mobile-first layout
- Card-based navigation and dynamic filtering
- Light and dark mode options

### Key Screens
- **Home Feed**: Scrollable feed of followed users' recipes, posts, and activities
- **Explore Page**: Trending recipes, ingredient explorer, spotlight on cooks
- **Recipe Page**: Hero image, ingredients, instructions, comments section
- **Meal Planner**: Calendar interface with drag-and-drop support
- **Profile Page**: User’s avatar, bio, posts, recipes, cookbooks
- **Create Recipe**: Rich editor for title, tags, steps, photos, video
- **AI Helper Modal**: Prompt-based recipe generator using OpenAI

