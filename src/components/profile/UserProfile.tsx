import { EditIcon, CheckIcon, CloseIcon, LockIcon, AlertIcon } from '@chakra-ui/icons';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  Divider,
  useToast,
  Badge,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Alert,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { asyncStorageService } from '@/services/asyncStorage';
import {
  disableBiometricAuth,
  getBiometricData,
  saveBiometricCredential,
} from '@/services/firestore';
import { useAuthStore } from '@/store/authStore';
import { SUPPORTED_LANGUAGES } from '@/utils/constants';
import { validateEmail, validatePhoneNumber } from '@/utils/validation';

const UserProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { user, updateUser } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    language: user?.preferences?.language || 'en',
    notifications: user?.preferences?.notifications || true,
    theme: user?.preferences?.theme || 'light',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        language: user.preferences?.language || 'en',
        notifications: user.preferences?.notifications || true,
        theme: user.preferences?.theme || 'light',
      });

      // Check biometric status
      checkBiometricStatus();
    }
  }, [user]);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const webAuthnSupported = !!(navigator.credentials && navigator.credentials.create);
    let platformSupported = false;

    try {
      if (window.PublicKeyCredential) {
        platformSupported =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
    } catch (err) {
      console.log('Platform authenticator check failed:', err);
    }

    setBiometricSupported(webAuthnSupported && platformSupported);
  };

  const checkBiometricStatus = async () => {
    if (!user) return;

    try {
      const biometricData = await getBiometricData(user.uid);
      setBiometricEnabled(biometricData?.enabled || false);
    } catch (error) {
      console.error('Error checking biometric status:', error);
    }
  };

  const handleEnableBiometric = async () => {
    if (!user) return;

    setBiometricLoading(true);

    try {
      // Generate WebAuthn credential
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credentialCreationOptions: CredentialCreationOptions = {
        publicKey: {
          challenge,
          rp: {
            name: 'City Pulse',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(user.uid),
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
      )) as PublicKeyCredential;

      if (credential) {
        try {
          // Try to save to Firestore first
          await saveBiometricCredential(user.uid, credential.id);
          await asyncStorageService.saveBiometricCredential(user.uid, credential.id);
        } catch (firestoreError) {
          console.warn('Firestore save failed, using local storage:', firestoreError);

          // Fallback to local storage
          await asyncStorageService.saveBiometricCredential(user.uid, credential.id);
        }

        setBiometricEnabled(true);
        toast({
          title: 'Biometric Login Enabled',
          description: 'You can now use biometric authentication to login',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Error enabling biometric:', error);

      let errorMessage = 'Failed to enable biometric authentication';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'User cancelled biometric registration';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'This device already has biometric credentials for this account';
      }

      toast({
        title: 'Failed to Enable Biometric',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleDisableBiometric = async () => {
    if (!user) return;

    try {
      await disableBiometricAuth(user.uid);
      setBiometricEnabled(false);

      toast({
        title: 'Biometric Login Disabled',
        description: 'Biometric authentication has been disabled for your account',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disable biometric authentication',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors;
    }

    const phoneValidation = validatePhoneNumber(formData.phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.errors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !user) return;

    try {
      const updatedUser = {
        ...user,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        preferences: {
          ...user.preferences,
          language: formData.language,
          notifications: formData.notifications,
          theme: formData.theme,
        },
      };

      updateUser(updatedUser);

      // Update language if changed
      if (formData.language !== i18n.language) {
        i18n.changeLanguage(formData.language);
      }

      setIsEditing(false);
      toast({
        title: t('profile.saveChanges'),
        description: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        language: user.preferences?.language || 'en',
        notifications: user.preferences?.notifications || true,
        theme: user.preferences?.theme || 'light',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Box textAlign="center" py={8}>
        <Text>Please sign in to view your profile</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">{t('profile.personalInfo')}</Heading>
            {!isEditing ? (
              <Button leftIcon={<EditIcon />} size="sm" onClick={() => setIsEditing(true)}>
                {t('profile.editProfile')}
              </Button>
            ) : (
              <HStack>
                <Button leftIcon={<CheckIcon />} colorScheme="green" size="sm" onClick={handleSave}>
                  {t('common.save')}
                </Button>
                <Button leftIcon={<CloseIcon />} variant="ghost" size="sm" onClick={handleCancel}>
                  {t('common.cancel')}
                </Button>
              </HStack>
            )}
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <Avatar
                size="xl"
                {...(user.photoURL && { src: user.photoURL })}
                name={user.displayName || user.email}
              />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Text>
                <Badge colorScheme={user.emailVerified ? 'green' : 'yellow'}>
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </VStack>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.displayName?.length}>
                <FormLabel>Display Name</FormLabel>
                <Input
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  isReadOnly={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.email?.length}>
                <FormLabel>{t('auth.email')}</FormLabel>
                <Input value={formData.email} isReadOnly bg="gray.50" />
                <Text fontSize="xs" color="gray.500">
                  Email cannot be changed
                </Text>
              </FormControl>

              <FormControl isInvalid={!!errors.phoneNumber?.length}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  isReadOnly={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                  placeholder="Enter phone number"
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('settings.language')}</FormLabel>
                <Select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  isDisabled={!isEditing}
                  bg={isEditing ? 'white' : 'gray.50'}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            <Divider />

            <Heading size="sm">{t('profile.preferences')}</Heading>

            <HStack justify="space-between">
              <Text>{t('profile.notifications')}</Text>
              <Switch
                isChecked={formData.notifications}
                onChange={(e) => handleInputChange('notifications', e.target.checked)}
                isDisabled={!isEditing}
              />
            </HStack>

            <HStack justify="space-between">
              <Text>{t('profile.theme')}</Text>
              <Select
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                isDisabled={!isEditing}
                bg={isEditing ? 'white' : 'gray.50'}
                width="150px"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <Heading size="md" display="flex" alignItems="center">
            <LockIcon mr={2} />
            {t('profile.security')}
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {!biometricSupported ? (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm">{t('profile.biometricNotSupported')}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {t('profile.biometricRequirements')}
                  </Text>
                </VStack>
              </Alert>
            ) : (
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={1} flex={1}>
                  <HStack>
                    <Text fontWeight="medium">{t('profile.biometricLogin')}</Text>
                    {biometricEnabled && (
                      <Badge colorScheme="green" size="sm">
                        {t('profile.enabled')}
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {t('profile.biometricDescription')}
                  </Text>
                  {biometricEnabled && (
                    <Text fontSize="xs" color="blue.500">
                      ✅ {t('profile.biometricEnabled')}
                    </Text>
                  )}
                </VStack>

                <VStack spacing={2}>
                  {biometricEnabled ? (
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={handleDisableBiometric}
                    >
                      {t('profile.disableBiometric')}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="primary"
                      onClick={handleEnableBiometric}
                      isLoading={biometricLoading}
                      loadingText={t('profile.enabling')}
                    >
                      {t('profile.enableBiometric')}
                    </Button>
                  )}
                </VStack>
              </HStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default UserProfile;
