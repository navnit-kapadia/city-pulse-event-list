import { VStack, Heading, Text, SimpleGrid, Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';

import Layout from '@/components/common/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import EventCard from '@/components/events/EventCard';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';

const FavoritesPage: FC = () => {
  const { user } = useAuthStore();
  const { favoriteEvents, loadFavorites, isLoading } = useEventStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner message={t('favorites.loading')} />
      </Layout>
    );
  }

  return (
    <Layout>
      <ProtectedRoute>
        <VStack spacing={6} align="stretch">
          <Heading size="xl">{t('favorites.title')}</Heading>

          {favoriteEvents.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {favoriteEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color="gray.500" mb={2}>
                {t('favorites.empty')}
              </Text>
              <Text color="gray.400">{t('favorites.addEvents')}</Text>
            </Box>
          )}
        </VStack>
      </ProtectedRoute>
    </Layout>
  );
};

export default FavoritesPage;
