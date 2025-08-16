import { Box, useBreakpointValue } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { memo } from 'react';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';

import type { Event } from '@/types/event';

interface EventMapProps {
  event: Event;
  height?: string | number;
  className?: string;
}

const EventMap = memo(({ event, height = '300px', className = '' }: EventMapProps) => {
  const { t } = useTranslation();
  const venue = event._embedded?.venues?.[0];
  const mapZoom = useBreakpointValue({ base: 14, md: 15 });

  if (!venue?.location?.latitude || !venue?.location?.longitude) {
    return (
      <Box
        height={height}
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        data-testid="location-unavailable"
      >
        {t('event.locationNotAvailable')}
      </Box>
    );
  }

  const position: LatLngExpression = [
    parseFloat(venue.location.latitude),
    parseFloat(venue.location.longitude),
  ];

  const mapContainerStyle = {
    height: '100%',
    width: '100%',
    minHeight: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <Box
      height={height}
      borderRadius="md"
      overflow="hidden"
      className={className}
      data-testid="event-map"
    >
      <MapContainer
        center={position}
        zoom={mapZoom}
        style={mapContainerStyle}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup closeButton={false}>
            <Box p={2}>
              <Box fontWeight="bold" mb={1}>
                {venue.name}
              </Box>
              {venue.address?.line1 && <Box fontSize="sm">{venue.address.line1}</Box>}
              {venue.city?.name && <Box fontSize="sm">{venue.city.name}</Box>}
            </Box>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
});

export default EventMap;
