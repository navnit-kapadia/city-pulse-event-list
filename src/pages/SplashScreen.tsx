import { Box, VStack, Heading, Spinner, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { FC } from 'react';


import { useAuthStore } from '@/store/authStore';

const SPLASH_DELAY = 2000;

const SplashScreen: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { initAuth, isLoading, isAuthenticated } = useAuthStore();

  // Initialize authentication on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Handle navigation after authentication check
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/home' : '/welcome');
    }, SPLASH_DELAY);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, primary.500, secondary.500)"
      color="white"
    >
      <VStack spacing={8}>
        <Heading size="2xl" textAlign="center">
          {t('common.cityPulse')}
        </Heading>
        <Text fontSize="lg" opacity={0.9}>
          {t('welcome.discoverEvents')}
        </Text>
        <Spinner size="xl" thickness="4px" />
      </VStack>
    </Box>
  );
};

export default SplashScreen;
