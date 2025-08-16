# City Pulse Explorer 🌆

A modern web application for discovering and exploring local events and activities in your city. Built with React 19, TypeScript, and Vite.

[![Live Demo](https://img.shields.io/badge/🌐-Live%20Demo-blue)](https://city-pulse-event-list.vercel.app/)

## 🌟 Features

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
- Firebase account (for authentication and database)
- Ticketmaster API key (for event data)

### 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/city-pulse-explorer.git
   cd city-pulse-explorer
   ```

2. **Install dependencies**

   ```bash
   pnpm install  # Recommended
   # or
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id

   # Ticketmaster API
   VITE_TICKETMASTER_API_KEY=your-ticketmaster-api-key
   VITE_TICKETMASTER_API_URL=https://app.ticketmaster.com/discovery/v2
   ```

4. **Running the Application**

   ```bash
   # Development mode
   pnpm dev

   # Production build
   pnpm build
   pnpm preview
   ```

## 🌍 Live Demo

Explore the live version of City Pulse Explorer:

🔗 [https://city-pulse-event-list.vercel.app/](https://city-pulse-event-list.vercel.app/)

## 🔄 Assumptions

1. **API Dependencies**

   - A working internet connection is required to fetch event data from Ticketmaster API
   - Firebase services are used for authentication and data persistence

2. **Browser Support**

   - Modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support
   - Mobile responsiveness is implemented but may vary by device

3. **Authentication**

   - Email/password authentication is implemented
   - Biometric login is available on supported devices

4. **Data**
   - Event data is fetched in real-time from Ticketmaster API
   - User preferences and favorites are stored in Firestore

## 🛠 Available Scripts

- `dev` - Start development server
- `build` - Create production build
- `preview` - Preview production build locally
- `test` - Run test suite
- `lint` - Run ESLint for code quality
- `format` - Format code with Prettier

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tooling
- [Chakra UI](https://chakra-ui.com/) for the awesome component library
- [React](https://react.dev/) for the UI library
