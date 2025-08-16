export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchParams {
  keyword?: string;
  city?: string;
  countryCode?: string;
  postalCode?: string;
  radius?: number;
  unit?: 'km' | 'miles';
  startDateTime?: string;
  endDateTime?: string;
  classificationName?: string;
  size?: number;
  page?: number;
  sort?: string;
}
