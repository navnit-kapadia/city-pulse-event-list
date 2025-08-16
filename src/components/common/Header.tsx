import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  Select,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { FC, ChangeEvent } from 'react';

import { useAuthStore } from '@/store/authStore';

type Language = 'en' | 'ar';

interface LanguageOption {
  value: Language;
  label: string;
  key: keyof typeof languageKeys;
}

const languageKeys = {
  english: 'languages.english',
  arabic: 'languages.arabic',
} as const;

const languageOptions: LanguageOption[] = [
  { value: 'en', label: '🇺🇸 English', key: 'english' },
  { value: 'ar', label: '🇸🇦 العربية', key: 'arabic' },
];

const Header: FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  const changeLanguage = useCallback(
    (language: Language): void => {
      i18n.changeLanguage(language);
      document.dir = language === 'ar' ? 'rtl' : 'ltr';
    },
    [i18n]
  );

  const handleLanguageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>): void => {
      const language = e.target.value as Language;
      changeLanguage(language);
    },
    [changeLanguage]
  );

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await logout();
      navigate('/home');
    } catch (error: unknown) {
      console.error('Logout error:', error);
    }
  }, [logout, navigate]);

  const handleLogoClick = useCallback((): void => {
    navigate('/home');
  }, [navigate]);

  const handleLoginClick = useCallback((): void => {
    navigate('/login');
  }, [navigate]);

  const handleProfileClick = useCallback((): void => {
    navigate('/profile');
  }, [navigate]);

  const handleFavoritesClick = useCallback((): void => {
    navigate('/favorites');
  }, [navigate]);

  const getUserDisplayName = useCallback((): string => {
    if (!user) return '';
    return user.displayName || user.email?.split('@')[0] || '';
  }, [user]);

  const getUserAvatarName = useCallback((): string => {
    if (!user) return '';
    return user.displayName || user.email || '';
  }, [user]);

  const currentLanguage = i18n.language as Language;

  return (
    <Box bg="white" shadow="sm" px={4} py={3}>
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
        <Heading size="lg" color="primary.600" cursor="pointer" onClick={handleLogoClick}>
          {t('common.cityPulse')}
        </Heading>

        <HStack spacing={4}>
          <Select size="sm" value={currentLanguage} onChange={handleLanguageChange} width="auto">
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(languageKeys[option.key])}
              </option>
            ))}
          </Select>

          {isLoading ? (
            <HStack>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.500">
                {t('navigation.loading')}
              </Text>
            </HStack>
          ) : isAuthenticated && user ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
                <HStack>
                  <Avatar
                    size="sm"
                    {...(user.photoURL && { src: user.photoURL })}
                    name={getUserAvatarName()}
                  />
                  <Text fontSize="sm" display={{ base: 'none', md: 'block' }}>
                    {getUserDisplayName()}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleProfileClick}>{t('navigation.profile')}</MenuItem>
                <MenuItem onClick={handleFavoritesClick}>{t('navigation.favorites')}</MenuItem>
                <MenuItem onClick={handleLogout}>{t('navigation.logout')}</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme="primary" size="sm" onClick={handleLoginClick}>
              {t('navigation.login')}
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
