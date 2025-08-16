import { create } from 'zustand';

import { asyncStorageService } from '@/services/asyncStorage';
import { ticketmasterAPI } from '@/services/ticketmaster';
import { Event } from '@/types/event';

interface EventStore {
  events: Event[];
  currentEvent: Event | null;
  favoriteEvents: Event[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  currentCity: string;

  searchEvents: (keyword: string, city: string) => Promise<void>;
  getEventById: (eventId: string) => Promise<void>;
  addToFavorites: (event: Event) => Promise<void>;
  removeFromFavorites: (eventId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCurrentCity: (city: string) => void;
  clearError: () => void;
  loadAllEvents: (page?: number) => Promise<void>;
}

const handleApiError = (error: unknown): string => {
  return error instanceof Error ? error.message : 'An error occurred';
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  currentEvent: null,
  favoriteEvents: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  currentCity: '',

  loadAllEvents: async (page = 0) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ticketmasterAPI.getAllEvents(page, 50);

      if (response.success && response.data) {
        set({
          events: response.data._embedded?.events || [],
          searchQuery: '',
          currentCity: '',
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch events',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: handleApiError(error),
        isLoading: false,
      });
    }
  },

  searchEvents: async (keyword: string, city: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ticketmasterAPI.searchEvents({
        keyword,
        city,
        size: 50,
      });

      if (response.success && response.data) {
        set({
          events: response.data._embedded?.events || [],
          searchQuery: keyword,
          currentCity: city,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch events',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: handleApiError(error),
        isLoading: false,
      });
    }
  },

  getEventById: async (eventId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await ticketmasterAPI.getEventById(eventId);

      if (response.success && response.data) {
        set({
          currentEvent: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch event details',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: handleApiError(error),
        isLoading: false,
      });
    }
  },

  addToFavorites: async (event: Event) => {
    try {
      await asyncStorageService.saveFavoriteEvent(event);
      const { favoriteEvents } = get();

      if (!favoriteEvents.find((fav) => fav.id === event.id)) {
        set({
          favoriteEvents: [...favoriteEvents, event],
        });
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      set({ error: 'Failed to add to favorites' });
    }
  },

  removeFromFavorites: async (eventId: string) => {
    try {
      await asyncStorageService.removeFavoriteEvent(eventId);
      const { favoriteEvents } = get();

      set({
        favoriteEvents: favoriteEvents.filter((event) => event.id !== eventId),
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      set({ error: 'Failed to remove from favorites' });
    }
  },

  loadFavorites: async () => {
    try {
      const favorites = await asyncStorageService.getFavoriteEvents();
      set({ favoriteEvents: favorites });
    } catch (error) {
      console.error('Error loading favorites:', error);
      set({ error: 'Failed to load favorites' });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setCurrentCity: (city: string) => set({ currentCity: city }),
  clearError: () => set({ error: null }),
}));
