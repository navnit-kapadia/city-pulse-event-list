import { useCallback } from 'react';

import { useEventStore } from '@/store/eventStore';
import { SearchParams } from '@/types/api';

export const useEvents = () => {
  const {
    events,
    currentEvent,
    favoriteEvents,
    isLoading,
    error,
    searchQuery,
    currentCity,
    searchEvents,
    getEventById,
    addToFavorites,
    removeFromFavorites,
    loadFavorites,
    setSearchQuery,
    setCurrentCity,
    clearError,
  } = useEventStore();

  const searchEventsWithParams = useCallback(
    async (params: SearchParams) => {
      const { keyword = '', city = '' } = params;
      await searchEvents(keyword, city);
    },
    [searchEvents]
  );

  const toggleFavorite = useCallback(
    async (eventId: string) => {
      const isFavorite = favoriteEvents.some((event) => event.id === eventId);

      if (isFavorite) {
        await removeFromFavorites(eventId);
      } else {
        const event = events.find((e) => e.id === eventId) || currentEvent;
        if (event) {
          await addToFavorites(event);
        }
      }
    },
    [favoriteEvents, events, currentEvent, addToFavorites, removeFromFavorites]
  );

  const isFavorite = useCallback(
    (eventId: string) => favoriteEvents.some((event) => event.id === eventId),
    [favoriteEvents]
  );

  return {
    events,
    currentEvent,
    favoriteEvents,
    isLoading,
    error,
    searchQuery,
    currentCity,
    searchEvents: searchEventsWithParams,
    getEventById,
    toggleFavorite,
    isFavorite,
    loadFavorites,
    setSearchQuery,
    setCurrentCity,
    clearError,
  };
};
