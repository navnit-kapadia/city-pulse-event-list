import { StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Image,
  Text,
  Heading,
  Button,
  HStack,
  VStack,
  Badge,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import type { Event } from '@/types/event';

import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';

interface EventCardProps {
  event: Event;
}

const EventCard = memo(({ event }: EventCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { addToFavorites, removeFromFavorites, favoriteEvents } = useEventStore();
  const { user, isAuthenticated } = useAuthStore();

  const isFavorite = favoriteEvents.some((fav) => fav.id === event.id);
  const eventImage = event.images?.[0]?.url || '/placeholder-event.jpg';
  const eventDate = new Date(event.dates?.start?.localDate || '').toLocaleDateString();
  const eventTime = event.dates?.start?.localTime || '';
  const venue = event._embedded?.venues?.[0];

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event card navigation

    if (!isAuthenticated || !user) {
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
        await removeFromFavorites(event.id);
        toast({
          title: t('event.removeFromFavorites'),
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        await addToFavorites(event);
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

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      shadow="md"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      onClick={handleCardClick}
      cursor="pointer"
      role="article"
      aria-label={event.name}
    >
      <Box position="relative">
        <Image src={eventImage} alt={event.name} height="200px" width="100%" objectFit="cover" />
        <IconButton
          aria-label={isFavorite ? t('event.removeFromFavorites') : t('event.addToFavorites')}
          icon={<StarIcon />}
          position="absolute"
          top={2}
          right={2}
          colorScheme={isFavorite ? 'red' : 'gray'}
          variant={isFavorite ? 'solid' : 'outline'}
          size="sm"
          onClick={handleFavoriteToggle}
          bg={isFavorite ? 'red.500' : 'white'}
          _hover={{ bg: isFavorite ? 'red.600' : 'gray.100' }}
          aria-pressed={isFavorite}
        />
      </Box>

      <Box p={4}>
        <VStack align="stretch" spacing={3}>
          <Heading size="md" noOfLines={2}>
            {event.name}
          </Heading>

          {event.classifications?.[0] && (
            <Badge colorScheme="primary" width="fit-content">
              {event.classifications?.[0].segment?.name}
            </Badge>
          )}

          <VStack align="stretch" spacing={1} fontSize="sm" color="gray.600">
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
          </VStack>

          <HStack spacing={2} pt={2}>
            <Button
              colorScheme="primary"
              size="sm"
              flex={1}
              onClick={handleCardClick}
              aria-label={`${t('event.viewDetails')} for ${event.name}`}
            >
              {t('event.viewDetails')}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
});

export default EventCard;
