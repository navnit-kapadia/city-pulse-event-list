import { ApiResponse } from '@/types/api';
import { Event, EventsResponse, SearchParams } from '@/types/event';

const BASE_URL = import.meta.env.VITE_TICKETMASTER_API_URL;
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

class TicketmasterAPI {
  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${BASE_URL}${endpoint}`);
      url.searchParams.append('apikey', API_KEY);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getAllEvents(page = 0, size = 50): Promise<ApiResponse<EventsResponse>> {
    const queryParams = {
      size: size,
      page: page,
      sort: 'date,asc',
      countryCode: 'US', // You can make this configurable
    };

    return this.makeRequest<EventsResponse>('/events', queryParams);
  }

  async searchEvents(params: SearchParams): Promise<ApiResponse<EventsResponse>> {
    const queryParams = {
      keyword: params.keyword,
      city: params.city,
      countryCode: params.countryCode || 'US',
      radius: params.radius || 50,
      unit: params.unit || 'km',
      size: params.size || 20,
      page: params.page || 0,
      sort: params.sort || 'date,asc',
      startDateTime: params.startDateTime,
      endDateTime: params.endDateTime,
      classificationName: params.classificationName,
    };

    return this.makeRequest<EventsResponse>('/events', queryParams);
  }

  async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    return this.makeRequest<Event>(`/events/${eventId}`);
  }

  async getEventImages(eventId: string): Promise<ApiResponse<{ images: any[] }>> {
    return this.makeRequest<{ images: any[] }>(`/events/${eventId}/images`);
  }

  async getVenueDetails(venueId: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/venues/${venueId}`);
  }

  async getAttractionDetails(attractionId: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`/attractions/${attractionId}`);
  }
}

export const ticketmasterAPI = new TicketmasterAPI();
