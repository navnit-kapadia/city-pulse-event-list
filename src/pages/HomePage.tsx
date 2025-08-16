import { VStack, Heading, Text, Box, Alert, AlertIcon, Button, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { FC } from 'react';

import Layout from '@/components/common/Layout';
import EventList from '@/components/events/EventList';
import SearchForm from '@/components/events/SearchForm';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';

const HomePage: FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const { loadAllEvents } = useEventStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadAllEvents();
    }
  }, [isAuthenticated, loadAllEvents]);

  const handleSignIn = (): void => {
    navigate('/login');
  };

  const handleSignUp = (): void => {
    navigate('/signup');
  };

  return (
    <Layout>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>
            {t('common.cityPulse')}
          </Heading>
          <Text color="gray.600" fontSize="lg">
            {t('welcome.subtitle')}
          </Text>
        </Box>

        {/* Show login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <Box flex="1">
              <Text>{t('welcome.cta.description')}</Text>
            </Box>
            <HStack spacing={2} ml={4}>
              <Button size="sm" colorScheme="primary" onClick={handleSignIn}>
                {t('auth.signIn')}
              </Button>
              <Button size="sm" variant="outline" onClick={handleSignUp}>
                {t('auth.signUp')}
              </Button>
            </HStack>
          </Alert>
        )}

        <SearchForm />
        <EventList />
      </VStack>
    </Layout>
  );
};

export default HomePage;
