import {
  useCallback,
  useState,
} from "react";

import {
  getCurrentLocation,
} from "../services/locationService";

export const useLocation = () => {
  const [location, setLocation] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const requestLocation =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const currentLocation =
          await getCurrentLocation();

        setLocation(currentLocation);

        return currentLocation;
      } catch (err) {
        setError(err.message);

        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

  return {
    location,
    loading,
    error,
    requestLocation,
  };
};