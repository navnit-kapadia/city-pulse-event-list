export interface Event {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: EventImage[];
  sales: {
    public: {
      startDateTime: string;
      endDateTime: string;
    };
  };
  dates: {
    start: {
      localDate: string;
      localTime: string;
      dateTime: string;
    };
  };
  classifications: Classification[];
  promoter?: {
    id: string;
    name: string;
  };
  info?: string;
  pleaseNote?: string;
  priceRanges?: PriceRange[];
  seatmap?: {
    staticUrl: string;
  };
  _embedded?: {
    venues: Venue[];
    attractions?: Attraction[];
  };
}

export interface EventImage {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}

export interface Classification {
  primary: boolean;
  segment: {
    id: string;
    name: string;
  };
  genre: {
    id: string;
    name: string;
  };
  subGenre?: {
    id: string;
    name: string;
  };
}

export interface PriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: EventImage[];
  postalCode: string;
  timezone: string;
  city: {
    name: string;
  };
  state?: {
    name: string;
    stateCode: string;
  };
  country: {
    name: string;
    countryCode: string;
  };
  address: {
    line1: string;
  };
  location: {
    longitude: string;
    latitude: string;
  };
}

export interface Attraction {
  id: string;
  name: string;
  type: string;
  url: string;
  locale: string;
  images: EventImage[];
  classifications: Classification[];
  upcomingEvents: {
    _total: number;
  };
}

export interface EventsResponse {
  _embedded: {
    events: Event[];
  };
  _links: {
    self: {
      href: string;
    };
    next?: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface SearchParams {
  keyword?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  classificationName?: string;
  startDateTime?: string;
  endDateTime?: string;
  size?: number;
  page?: number;
  sort?: string;
  radius?: number;
  unit?: string;
}
