export const APP_CONFIG = {
  name: 'City Pulse',
  version: '1.0.0',
  description: 'Discover amazing events in your city',
};

export const API_ENDPOINTS = {
  ticketmaster: {
    base: import.meta.env.VITE_TICKETMASTER_API_URL as string,
    events: '/events',
    eventDetails: (id: string) => `/events/${id}`,
    eventImages: (id: string) => `/events/${id}/images`,
    venues: '/venues',
    attractions: '/attractions',
  },
};

export const ROUTES = {
  home: '/',
  splash: '/',
  events: '/events',
  eventDetails: (id: string) => `/events/${id}`,
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  favorites: '/favorites',
} as const;

export const STORAGE_KEYS = {
  user: 'cityPulse_user',
  favorites: 'cityPulse_favorites',
  preferences: 'cityPulse_preferences',
  language: 'cityPulse_language',
} as const;

export const DEFAULT_SEARCH_PARAMS = {
  size: 20,
  page: 0,
  radius: 50,
  unit: 'km' as const,
  sort: 'date,asc' as const,
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
] as const;

export const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Arts & Theatre',
  'Film',
  'Miscellaneous',
  'Undefined',
] as const;

export const BIOMETRIC_SUPPORT_CHECK = () => {
  return 'credentials' in navigator && 'create' in navigator.credentials;
};

export const MAP_CONFIG = {
  defaultZoom: 15,
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};
