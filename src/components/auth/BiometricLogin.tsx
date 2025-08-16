import { LockIcon } from '@chakra-ui/icons';
import {
  VStack,
  Button,
  Text,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { asyncStorageService } from '@/services/asyncStorage';
import { useAuthStore } from '@/store/authStore';

interface BiometricLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
  mode?: 'login' | 'register';
}

type BiometricMode = 'login' | 'register';

interface BiometricLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
  mode?: BiometricMode;
}

const BiometricLogin = ({ onSuccess, onCancel, mode = 'login' }: BiometricLoginProps) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, loginWithBiometric } = useAuthStore();
  const [isSupported, setIsSupported] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegisterMode = mode === 'register';

  const checkBiometricSupport = useCallback(async () => {
    const webAuthnSupported = Boolean(navigator.credentials && navigator.credentials.create);

    let platformSupported = false;
    try {
      if (window.PublicKeyCredential) {
        platformSupported =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
    } catch (err) {
      console.log('Platform authenticator check failed:', err);
    }

    setIsSupported(webAuthnSupported && platformSupported);
  }, []);

  useEffect(() => {
    checkBiometricSupport();
    onOpen();
  }, [checkBiometricSupport, onOpen]);

  const generateRandomBytes = useCallback((length: number) => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
  }, []);

  const handleBiometricRegister = useCallback(async () => {
    if (!user) {
      setError(t('auth.biometricRegisterError'));
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      const challenge = generateRandomBytes(32);
      const userId = new TextEncoder().encode(user.uid);

      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'City Pulse',
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: user.email,
            displayName: user.displayName || user.email,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },
            { alg: -257, type: 'public-key' },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: true,
          },
          timeout: 60000,
          attestation: 'none',
        },
      };

      const credential = (await navigator.credentials.create(
        credentialCreationOptions
      )) as PublicKeyCredential | null;

      if (credential) {
        await asyncStorageService.saveBiometricCredential(user.uid, credential.id);
        console.log('Biometric credential registered successfully');

        setIsAuthenticating(false);
        onClose();
        onSuccess();
      }
    } catch (err: unknown) {
      console.error('Biometric registration error:', err);

      let errorMessage = t('auth.biometricRegisterFailed');

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = t('auth.biometricCancelled');
        } else if (err.name === 'InvalidStateError') {
          errorMessage = t('auth.biometricAlreadyExists');
        }
      }

      setError(errorMessage);
      setIsAuthenticating(false);
    }
  }, [user, generateRandomBytes, onClose, onSuccess, t]);

  const handleBiometricLogin = useCallback(async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const biometricData = await asyncStorageService.getBiometricCredential();
      if (!biometricData) {
        throw new Error(t('auth.biometricCredentialNotFound'));
      }

      const challenge = generateRandomBytes(32);

      const credentialRequestOptions: CredentialRequestOptions = {
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          allowCredentials: [
            {
              id: new TextEncoder().encode(biometricData.credentialId),
              type: 'public-key',
              transports: ['internal'],
            },
          ],
        },
      };

      const assertion = (await navigator.credentials.get(
        credentialRequestOptions
      )) as PublicKeyCredential | null;

      if (assertion) {
        await loginWithBiometric(assertion.id);

        setIsAuthenticating(false);
        onClose();
        onSuccess();
      }
    } catch (err: unknown) {
      console.error('Biometric login error:', err);

      let errorMessage = t('auth.biometricAuthFailed');

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = t('auth.biometricAuthCancelled');
        } else if (err.message.includes('not found')) {
          errorMessage = t('auth.biometricNotFound');
        } else if (err.message.includes('session expired')) {
          errorMessage = t('auth.biometricSessionExpired');
        }
      }

      setError(errorMessage);
      setIsAuthenticating(false);
    }
  }, [generateRandomBytes, loginWithBiometric, onClose, onSuccess, t]);

  const handleClose = useCallback(() => {
    onClose();
    onCancel();
  }, [onClose, onCancel]);

  const handleAuthAction = useCallback(() => {
    return isRegisterMode ? handleBiometricRegister() : handleBiometricLogin();
  }, [isRegisterMode, handleBiometricRegister, handleBiometricLogin]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {isRegisterMode ? t('auth.biometricRegister') : t('auth.biometricLogin')}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            <Icon as={LockIcon} boxSize={16} color="primary.500" />

            {!isSupported ? (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm">{t('auth.biometricNotSupported')}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {t('auth.biometricRequirements')}
                  </Text>
                </VStack>
              </Alert>
            ) : error ? (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">{error}</Text>
              </Alert>
            ) : (
              <VStack spacing={3}>
                <Text textAlign="center" color="gray.600">
                  {isRegisterMode ? t('auth.biometricRegisterDesc') : t('auth.biometricLoginDesc')}
                </Text>
                <Text fontSize="sm" color="blue.500" textAlign="center">
                  {t('auth.biometricDataAccess')}
                </Text>
              </VStack>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <VStack spacing={3} width="full">
            {isSupported && !error && (
              <Button
                colorScheme="primary"
                width="full"
                onClick={handleAuthAction}
                isLoading={isAuthenticating}
                loadingText={
                  isRegisterMode
                    ? t('auth.biometricRegistering')
                    : t('auth.biometricAuthenticating')
                }
              >
                {isRegisterMode ? t('auth.biometricRegisterButton') : t('auth.biometricAuthButton')}
              </Button>
            )}

            <Button variant="ghost" onClick={handleClose} width="full">
              {t('common.cancel')}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BiometricLogin;
