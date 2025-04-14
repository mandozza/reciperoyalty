# 👑 Recipe Royalty

A modern recipe sharing and meal planning platform built with Next.js 14, MongoDB, and TypeScript.

## 🚀 Features

- 📱 Modern, responsive UI built with ShadcnUI and Tailwind CSS
- 🔐 Secure authentication with NextAuth.js (Email & Google OAuth)
- 📦 MongoDB database with Mongoose ODM
- 🌙 Dark mode support
- 📱 Mobile-first design
- ♿ Accessibility focused
- 🎨 Component library with Storybook
- ✨ Type-safe with TypeScript

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Auth:** NextAuth.js
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS + ShadcnUI
- **Components:** Storybook
- **Validation:** Zod
- **Linting:** ESLint + Prettier
- **Testing:** Jest (coming soon)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/recipe-royalty.git
cd recipe-royalty
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your values:
- Generate NextAuth secret: `openssl rand -base64 32`
- Set up MongoDB database
- Configure Google OAuth credentials
- Set up email provider

5. Start the development server:
```bash
npm run dev
```

## 🌍 Environment Variables

Required environment variables:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# MongoDB
MONGODB_URI=your-mongodb-uri

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Provider
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email-user
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@example.com
```

## 📝 Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook server
- `npm run test` - Run tests (coming soon)

### Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # ShadcnUI components
│   └── ...          # Feature components
├── lib/             # Utilities and configurations
│   ├── api/         # API utilities
│   ├── auth/        # Authentication related
│   ├── db/          # Database utilities
│   ├── services/    # Service utilities
│   └── stores/      # State management
├── models/          # Mongoose models
├── types/           # TypeScript types
├── hooks/           # Custom React hooks
└── stories/         # Storybook stories
```

### Environment Modes

- **Development**: `.env.development` - Local development settings
- **Production**: `.env.production` - Production settings
- **Testing**: `.env.test` - Test environment settings

## 🧪 Testing

Coming soon:
- Unit tests with Jest
- Integration tests
- E2E tests with Cypress

## 📚 Documentation

- Component documentation available in Storybook
- API documentation (coming soon)
- Database schema documentation (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [ShadcnUI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
