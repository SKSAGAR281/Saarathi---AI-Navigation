import { useState, useEffect } from 'react';
import { Location } from '../types';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const error = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
      // Fallback to Delhi, India location for demo
      setLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'New Delhi, India (Demo Location)'
      });
    };

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });

    const watchId = navigator.geolocation.watchPosition(success, error);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error, loading };
};