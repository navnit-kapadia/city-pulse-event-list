import { ArrowBackIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Button,
  Badge,
  Divider,
  SimpleGrid,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import Layout from '@/components/common/Layout';
import EventMap from '@/components/events/EventMap';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';

const EventDetailsPage = (): JSX.Element => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const {
    currentEvent,
    isLoading,
    error,
    getEventById,
    addToFavorites,
    removeFromFavorites,
    favoriteEvents,
  } = useEventStore();

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (eventId) {
      getEventById(eventId);
    }
  }, [eventId, getEventById]);

  const isFavorite = currentEvent && favoriteEvents.some((fav) => fav.id === currentEvent.id);

  const handleFavoriteToggle = async (): Promise<void> => {
    if (!isAuthenticated || !user || !currentEvent) {
      toast({
        title: t('auth.signIn'),
        description: t('event.signInToAddFavorites'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(currentEvent.id);
        toast({
          title: t('event.removeFromFavorites'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        await addToFavorites(currentEvent);
        toast({
          title: t('event.addToFavorites'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('event.favoritesUpdateFailed'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBackClick = (): void => {
    navigate(-1);
  };

  if (isLoading || !eventId) {
    return (
      <Layout>
        <VStack py={8}>
          <Spinner size="xl" color="primary.500" />
          <Text>{t('common.loading')}</Text>
        </VStack>
      </Layout>
    );
  }

  if (error || !currentEvent) {
    return (
      <Layout>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error || 'Event not found'}
        </Alert>
      </Layout>
    );
  }

  const venue = currentEvent._embedded?.venues?.[0];
  const eventImage = currentEvent.images?.[0]?.url;
  const eventDate = new Date(currentEvent.dates?.start?.localDate || '').toLocaleDateString();
  const eventTime = currentEvent.dates?.start?.localTime || '';

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button leftIcon={<ArrowBackIcon />} variant="ghost" onClick={handleBackClick}>
            {t('common.back')}
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <VStack align="stretch" spacing={4}>
            {eventImage && (
              <Image
                src={eventImage}
                alt={currentEvent.name}
                borderRadius="lg"
                maxHeight="400px"
                objectFit="cover"
              />
            )}

            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between" align="start">
                <Heading size="lg">{currentEvent.name}</Heading>

                <IconButton
                  aria-label="Add to favorites"
                  icon={<StarIcon />}
                  top={2}
                  right={2}
                  colorScheme={isFavorite ? 'red' : 'gray'}
                  variant={isFavorite ? 'solid' : 'outline'}
                  size="sm"
                  onClick={handleFavoriteToggle}
                  bg={isFavorite ? 'red.500' : 'white'}
                  _hover={{ bg: isFavorite ? 'red.600' : 'gray.100' }}
                />
              </HStack>

              {currentEvent.classifications?.[0] && (
                <HStack>
                  <Badge colorScheme="primary" fontSize="sm">
                    {currentEvent.classifications?.[0].segment?.name}
                  </Badge>
                  {currentEvent.classifications?.[0].genre && (
                    <Badge colorScheme="secondary" fontSize="sm">
                      {currentEvent.classifications?.[0].genre.name}
                    </Badge>
                  )}
                </HStack>
              )}

              <VStack align="stretch" spacing={3}>
                <Text>
                  <strong>{t('event.date')}:</strong> {eventDate}
                </Text>
                {eventTime && (
                  <Text>
                    <strong>{t('event.time')}:</strong> {eventTime}
                  </Text>
                )}
                {venue && (
                  <Text>
                    <strong>{t('event.venue')}:</strong> {venue.name}
                  </Text>
                )}
                {venue?.address && (
                  <Text>
                    <strong>{t('event.location')}:</strong> {venue.address.line1},{' '}
                    {venue.city?.name}
                  </Text>
                )}
              </VStack>

              {currentEvent.priceRanges && (
                <>
                  <Divider />
                  <VStack align="stretch" spacing={2}>
                    <Heading size="md">{t('event.ticketInfo')}</Heading>
                    {currentEvent.priceRanges.map((price, index) => (
                      <Text key={index}>
                        <strong>{price.type}:</strong> {price.currency} {price.min} - {price.max}
                      </Text>
                    ))}
                  </VStack>
                </>
              )}

              {currentEvent.info && (
                <>
                  <Divider />
                  <VStack align="stretch" spacing={2}>
                    <Heading size="md">{t('event.description')}</Heading>
                    <Text>{currentEvent.info}</Text>
                  </VStack>
                </>
              )}
            </VStack>
          </VStack>

          <Box>
            <Heading size="md" mb={4}>
              {t('event.location')}
            </Heading>
            <EventMap event={currentEvent} height="400px" />
          </Box>
        </SimpleGrid>
      </VStack>
    </Layout>
  );
};

export default EventDetailsPage;
