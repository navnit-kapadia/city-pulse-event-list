import { Box, VStack, Spinner, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router';

import type { FC, ReactNode } from 'react';

import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { t } = useTranslation();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600" fontSize="lg">
            {t('common.loading')}
          </Text>
        </VStack>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render protected content if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
