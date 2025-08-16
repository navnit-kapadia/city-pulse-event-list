import { Box, SimpleGrid, VStack, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import EventCard from './EventCard';

import type { Event } from '@/types/event';

import { useEventStore } from '@/store/eventStore';

interface EventListProps {
  events?: Event[];
  isLoading?: boolean;
  error?: string | null;
}

const EventList = memo(
  ({
    events: externalEvents,
    isLoading: externalIsLoading,
    error: externalError,
  }: EventListProps = {}) => {
    const { t } = useTranslation();
    const { events: storeEvents, isLoading: storeIsLoading, error: storeError } = useEventStore();

    const events = externalEvents ?? storeEvents;
    const isLoading = externalIsLoading ?? storeIsLoading;
    const error = externalError ?? storeError;

    if (isLoading) {
      return (
        <VStack py={8} data-testid="loading-indicator">
          <Spinner size="xl" color="primary.500" />
          <Text>{t('common.loading')}</Text>
        </VStack>
      );
    }

    if (error) {
      return (
        <Alert status="error" borderRadius="md" data-testid="error-message">
          <AlertIcon />
          {error || t('common.error')}
        </Alert>
      );
    }

    if (!events?.length) {
      return (
        <Box textAlign="center" py={8} data-testid="empty-state">
          <Text fontSize="lg" color="gray.500">
            {t('search.noResults')}
          </Text>
        </Box>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} data-testid="event-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            aria-label={`${event.name} - ${t('event.viewDetails')}`}
          />
        ))}
      </SimpleGrid>
    );
  }
);

export default EventList;
