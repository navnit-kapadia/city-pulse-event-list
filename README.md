# City Pulse Explorer

A modern web application for discovering and exploring local events and activities in your city. Built with React 19, TypeScript, and Vite.

## 🚀 Features

- 🔍 Discover local events and activities
- 🌍 Multi-language support (i18n)
- 🔒 Secure authentication with email/password and biometric login
- 💾 Offline support with service workers
- 🎨 Responsive design with Chakra UI
- 🚀 Optimized for performance with React 19 features
- 🛠 Type-safe with TypeScript

## 🛠 Tech Stack

- ⚡ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- ⚛️ [React 19](https://react.dev/) - A JavaScript library for building user interfaces
- 🏗 [TypeScript](https://www.typescriptlang.org/) - TypeScript is a typed superset of JavaScript
- 🎨 [Chakra UI](https://chakra-ui.com/) - Simple, modular and accessible component library
- 🌐 [i18next](https://www.i18next.com/) - Internationalization framework
- 🔐 [Firebase Authentication](https://firebase.google.com/docs/auth) - For user authentication
- 📦 [Zustand](https://github.com/pmndrs/zustand) - State management
- 🚀 [React Router](https://reactrouter.com/) - For client-side routing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase project setup (for authentication and Firestore)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/city-pulse-explorer.git
   cd city-pulse-explorer
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:

   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## 🏗 Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
├── config/          # App configuration
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization files
├── layouts/         # Layout components
├── pages/           # Page components
├── services/        # API and service integrations
├── store/           # State management
├── styles/          # Global styles
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🛠 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build locally
- `test` - Run tests
- `lint` - Run ESLint
- `format` - Format code with Prettier

## 🌍 Internationalization

The app supports multiple languages. To add a new language:

1. Add a new JSON file in `src/i18n/locales/`
2. Import and add it to the `resources` object in `src/i18n/i18n.ts`
3. Update the language selector in the UI

## 🚀 Deployment

### Firebase Hosting

1. Install Firebase CLI if you haven't already:

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Build the app:

   ```bash
   npm run build
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tooling
- [Chakra UI](https://chakra-ui.com/) for the awesome component library
- [React](https://react.dev/) for the UI library
