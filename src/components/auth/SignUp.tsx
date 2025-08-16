import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Link,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router';

import type { FC, ChangeEvent } from 'react';

import { useAuthStore } from '@/store/authStore';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '@/utils/validation';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Record<string, string[]>;

const SignUp: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { login, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string): void => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear errors for this field when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: [] }));
      }
    },
    [formErrors]
  );

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
      handleInputChange('email', e.target.value);
    },
    [handleInputChange]
  );

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
      handleInputChange('password', e.target.value);
    },
    [handleInputChange]
  );

  const handleConfirmPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
      handleInputChange('confirmPassword', e.target.value);
    },
    [handleInputChange]
  );

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }

    const confirmPasswordValidation = validatePasswordConfirmation(
      formData.password,
      formData.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.errors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSignUp = useCallback(async (): Promise<void> => {
    if (!validateForm()) return;

    toast({
      title: t('auth.featureComingSoon'),
      description: t('auth.emailRegistrationSoon'),
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }, [validateForm, toast, t]);

  const handleGoogleSignUp = useCallback(async (): Promise<void> => {
    try {
      await login();
      toast({
        title: t('auth.createAccount'),
        description: t('auth.accountCreated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/home');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.authenticationFailed');

      toast({
        title: t('auth.signUpFailed'),
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [login, toast, t, navigate]);

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={6}>
        <Heading size="lg" textAlign="center">
          {t('auth.createAccount')}
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={4} width="full">
          <FormControl isInvalid={Boolean(formErrors.email?.length)}>
            <FormLabel>{t('auth.email')}</FormLabel>
            <Input
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder={t('auth.emailPlaceholder')}
            />
            {formErrors.email?.map((error: string, index: number) => (
              <FormErrorMessage key={index}>{error}</FormErrorMessage>
            ))}
          </FormControl>

          <FormControl isInvalid={Boolean(formErrors.password?.length)}>
            <FormLabel>{t('auth.password')}</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder={t('auth.passwordPlaceholder')}
            />
            {formErrors.password?.map((error: string, index: number) => (
              <FormErrorMessage key={index}>{error}</FormErrorMessage>
            ))}
          </FormControl>

          <FormControl isInvalid={Boolean(formErrors.confirmPassword?.length)}>
            <FormLabel>{t('auth.confirmPassword')}</FormLabel>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder={t('auth.confirmPasswordPlaceholder')}
            />
            {formErrors.confirmPassword?.map((error: string, index: number) => (
              <FormErrorMessage key={index}>{error}</FormErrorMessage>
            ))}
          </FormControl>

          <Button
            colorScheme="primary"
            size="lg"
            width="full"
            onClick={handleSignUp}
            isLoading={isLoading}
            loadingText={t('auth.creatingAccount')}
          >
            {t('auth.createAccount')}
          </Button>

          <Divider />

          <Button
            leftIcon={<ExternalLinkIcon />}
            colorScheme="red"
            variant="outline"
            size="lg"
            width="full"
            onClick={handleGoogleSignUp}
            isLoading={isLoading}
            loadingText={t('auth.signingUp')}
          >
            {t('auth.signInWithGoogle')}
          </Button>
        </VStack>

        <Text fontSize="sm" color="gray.600" textAlign="center">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link as={RouterLink} to="/login" color="primary.500" fontWeight="medium">
            {t('auth.signIn')}
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default SignUp;
