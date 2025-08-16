import { ChakraProvider } from '@chakra-ui/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

import i18n from './i18n';
import theme from './styles/theme';

// Pages
import ProtectedRoute from '@/components/common/ProtectedRoute';
import EventDetailsPage from '@/pages/EventDetailsPage';
import FavoritesPage from '@/pages/FavoritesPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import PublicHomePage from '@/pages/PublicHomePage';
import SignUpPage from '@/pages/SignUpPage';
import SplashScreen from '@/pages/SplashScreen';

// Components

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/welcome" element={<PublicHomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:eventId"
              element={
                <ProtectedRoute>
                  <EventDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ChakraProvider>
    </I18nextProvider>
  );
}

export default App;
