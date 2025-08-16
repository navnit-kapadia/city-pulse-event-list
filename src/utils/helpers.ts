import type { Event } from '@/types/event';

const EARTH_RADIUS_KM = 6371;
const DEGREES_TO_RADIANS = Math.PI / 180;
const RADIANS_CONVERSION_FACTOR = 2;
const IMAGE_SIZE_RATIO = 2;

export const formatDate = (dateString: string, locale = 'en-US'): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (timeString: string, locale = 'en-US'): string => {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return '';

  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));

  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

export const getEventImageUrl = (
  event: Event,
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!event.images || event.images.length === 0) {
    return '/placeholder-event.jpg';
  }

  // Sort images by size and return appropriate one
  const sortedImages = [...event.images].sort((a, b) => b.width - a.width);

  switch (size) {
    case 'small': {
      const smallImage = sortedImages[sortedImages.length - 1];
      return smallImage?.url ?? sortedImages[0]?.url ?? '/placeholder-event.jpg';
    }
    case 'large': {
      const largeImage = sortedImages[0];
      return largeImage?.url ?? '/placeholder-event.jpg';
    }
    default: {
      const mediumIndex = Math.floor(sortedImages.length / IMAGE_SIZE_RATIO);
      const mediumImage = sortedImages[mediumIndex];
      return mediumImage?.url ?? sortedImages[0]?.url ?? '/placeholder-event.jpg';
    }
  }
};

export const generateEventShareUrl = (eventId: string): string => {
  if (typeof window === 'undefined') {
    return `https://your-domain.com/events/${eventId}`;
  }
  return `${window.location.origin}/events/${eventId}`;
};

export const isEventUpcoming = (event: Event): boolean => {
  const eventDateString = event.dates?.start?.dateTime ?? event.dates?.start?.localDate;
  if (!eventDateString) return false;

  const eventDate = new Date(eventDateString);
  return eventDate > new Date();
};

export const getDistanceFromCoords = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const dLat = (lat2 - lat1) * DEGREES_TO_RADIANS;
  const dLon = (lon2 - lon1) * DEGREES_TO_RADIANS;
  const a =
    Math.sin(dLat / RADIANS_CONVERSION_FACTOR) * Math.sin(dLat / RADIANS_CONVERSION_FACTOR) +
    Math.cos(lat1 * DEGREES_TO_RADIANS) *
      Math.cos(lat2 * DEGREES_TO_RADIANS) *
      Math.sin(dLon / RADIANS_CONVERSION_FACTOR) *
      Math.sin(dLon / RADIANS_CONVERSION_FACTOR);
  const c = RADIANS_CONVERSION_FACTOR * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export const debounce = <T extends (...args: readonly unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const formatEventDateTime = (event: Event, locale = 'en-US'): string => {
  const startDate = event.dates?.start?.localDate;
  const startTime = event.dates?.start?.localTime;

  if (!startDate) return 'Date TBD';

  const formattedDate = formatDate(startDate, locale);
  const formattedTime = startTime ? formatTime(startTime, locale) : '';

  return formattedTime ? `${formattedDate} at ${formattedTime}` : formattedDate;
};

export const getEventVenue = (event: Event): string => {
  const venue = event._embedded?.venues?.[0];
  return venue?.name ?? 'Venue TBD';
};

export const getEventLocation = (event: Event): string => {
  const venue = event._embedded?.venues?.[0];
  if (!venue) return 'Location TBD';

  const parts = [
    venue.city?.name,
    venue.state?.stateCode ?? venue.state?.name,
    venue.country?.countryCode,
  ].filter((part): part is string => Boolean(part));

  return parts.join(', ');
};
