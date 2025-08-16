import { useEffect, useCallback } from 'react';

import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { Event } from '@/types/event';

export const useFavorites = () => {
  const { user } = useAuthStore();
  const { favoriteEvents, addToFavorites, removeFromFavorites, loadFavorites } = useEventStore();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  const addFavorite = useCallback(
    async (event: Event) => {
      await addToFavorites(event);
    },
    [addToFavorites]
  );

  const removeFavorite = useCallback(
    async (eventId: string) => {
      await removeFromFavorites(eventId);
    },
    [removeFromFavorites]
  );

  const isFavorite = useCallback(
    (eventId: string) => favoriteEvents.some((event) => event.id === eventId),
    [favoriteEvents]
  );

  const toggleFavorite = useCallback(
    async (event: Event) => {
      const isCurrentlyFavorite = isFavorite(event.id);

      if (isCurrentlyFavorite) {
        await removeFavorite(event.id);
      } else {
        await addFavorite(event);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favoriteEvents,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
