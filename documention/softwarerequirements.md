# 🧑‍💻 Software Requirements Specification – Social Cooking Platform

## System Design
- **Client-Server Model** with REST API endpoints
- Web-first responsive architecture
- AI integration via OpenAI API for recipe generation
- Modular, component-based front-end with clean separation of concerns

## Architecture Pattern
- **Monorepo** using Next.js App Router with file-based routing
- Server-side rendering (SSR) for SEO-critical pages (e.g., Explore, Recipe)
- Client-side rendering (CSR) for dynamic, personalized content (e.g., Feed)
- Component-driven architecture powered by Storybook
- Folder-based organization by feature (e.g., `/recipes`, `/user`, `/planner`)

## State Management
- **React Context + useReducer** for lightweight global state (auth, theme)
- **Local component state** for UI control (modals, inputs)
- Optional: Zustand or Jotai for scalable state isolation (if needed)
- Favorites, user preferences, and theme saved to `localStorage`

## Data Flow
- Client interacts with API routes (Next.js) to fetch or mutate data
- Server validates and processes request, interacts with MongoDB via Mongoose
- API returns data to be rendered or updated in client state

## Technical Stack
- **Front-End:** React, Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS, Shadcn UI components
- **State:** React Context, local state
- **Database:** MongoDB (Atlas) via Mongoose
- **Auth:** NextAuth.js (Email & Google)
- **AI:** OpenAI (via server route)
- **Component Library:** Storybook

## Authentication Process
- Implemented with **NextAuth.js**
  - Providers: Email (magic link), Google OAuth
  - JWT-based session handling
  - Server-protected routes with session validation
  - Middleware to guard `/profile`, `/planner`, `/favorites`

## Route Design
### Public Routes
- `/`: Landing page
- `/explore`: Trending & featured recipes
- `/recipe/[slug]`: Individual recipe view
- `/login`: Authentication

### Protected Routes
- `/feed`: Personalized feed
- `/profile/[username]`: User profile
- `/planner`: Weekly meal planner
- `/cookbooks`: User-created digital cookbooks
- `/create`: New recipe or post
- `/ai-helper`: Modal or page for AI recipe suggestions

## API Design
- **RESTful API Routes (via Next.js `app/api`)**
- `/api/recipes` `GET/POST`
- `/api/recipes/[id]` `GET/PUT/DELETE`
- `/api/user/[id]` `GET`
- `/api/favorites` `POST/GET`
- `/api/planner` `GET/POST`
- `/api/cookbooks` `GET/POST`
- `/api/comments` `POST/GET`
- `/api/openai/recipe-gen` `POST`

## Database Design ERD
### Users
- `_id`
- `name`
- `email`
- `avatar`
- `bio`
- `createdAt`
- `followers` [User]
- `following` [User]

### Recipes
- `_id`
- `title`
- `slug`
- `ingredients` [Text]
- `steps` [Text]
- `media` [Image | Video]
- `tags` [String]
- `createdBy` (ref: User)
- `likes` [User]
- `comments` [Comment]
- `createdAt`

### Cookbooks
- `_id`
- `title`
- `coverImage`
- `createdBy` (ref: User)
- `recipes` [Recipe]
- `updatedAt`

### MealPlanner
- `_id`
- `userId` (ref: User)
- `weekStart`
- `meals`: { [day]: [Recipe] }

### Comments
- `_id`
- `text`
- `createdBy` (ref: User)
- `recipeId` (ref: Recipe)
- `createdAt`

### Reports (Moderation)
- `_id`
- `reportedBy` (ref: User)
- `contentId` (Recipe | Comment)
- `reason`
- `status`