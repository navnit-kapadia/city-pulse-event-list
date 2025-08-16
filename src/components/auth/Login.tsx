import { ExternalLinkIcon, LockIcon } from '@chakra-ui/icons';
import {
  Box,
  VStack,
  Heading,
  Button,
  Text,
  Link,
  Alert,
  AlertIcon,
  Divider,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router';

import BiometricLogin from './BiometricLogin';

import type { FC } from 'react';

import { useAuthStore } from '@/store/authStore';

interface LocationState {
  from?: string;
}

const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [showBiometric, setShowBiometric] = useState<boolean>(false);
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);

  const from = (location.state as LocationState)?.from || '/home';

  const checkBiometricAvailability = useCallback((): void => {
    const storedBiometric = localStorage.getItem('cityPulse_biometric');
    setBiometricAvailable(Boolean(storedBiometric));
  }, []);

  const handleGoogleLogin = useCallback(async (): Promise<void> => {
    try {
      await login();
      toast({
        title: t('auth.signIn'),
        description: t('auth.signInSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
    }
  }, [login, toast, t, navigate, from]);

  const handleBiometricSuccess = useCallback((): void => {
    toast({
      title: t('auth.biometricLogin'),
      description: t('auth.biometricSuccess'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate(from, { replace: true });
  }, [toast, t, navigate, from]);

  const handleShowBiometric = useCallback((): void => {
    setShowBiometric(true);
  }, []);

  const handleHideBiometric = useCallback((): void => {
    setShowBiometric(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    checkBiometricAvailability();
  }, [checkBiometricAvailability]);

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={6}>
        <Heading size="lg" textAlign="center">
          {t('auth.signIn')}
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={4} width="full">
          {/* Biometric Login Button (only show if previously registered) */}
          {biometricAvailable && (
            <>
              <Button
                leftIcon={<LockIcon />}
                colorScheme="green"
                size="lg"
                width="full"
                onClick={handleShowBiometric}
                variant="solid"
              >
                {t('auth.loginWithBiometrics')}
              </Button>

              <HStack width="full">
                <Divider />
                <Text fontSize="sm" color="gray.500" px={2}>
                  {t('auth.or')}
                </Text>
                <Divider />
              </HStack>
            </>
          )}

          {/* Google Login Button */}
          <Button
            leftIcon={<ExternalLinkIcon />}
            colorScheme="red"
            size="lg"
            width="full"
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            loadingText={t('auth.signingIn')}
          >
            {t('auth.signInWithGoogle')}
          </Button>

          {showBiometric && (
            <BiometricLogin
              mode="login"
              onSuccess={handleBiometricSuccess}
              onCancel={handleHideBiometric}
            />
          )}
        </VStack>

        <Text fontSize="sm" color="gray.600" textAlign="center">
          {t('auth.dontHaveAccount')}{' '}
          <Link as={RouterLink} to="/signup" color="primary.500" fontWeight="medium">
            {t('auth.signUp')}
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
