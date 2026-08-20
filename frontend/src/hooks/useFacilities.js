import { useEffect, useState } from "react";
import { getFacilities } from "../services/facilityApi";

export const useFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoading(true);

        const data = await getFacilities();

        setFacilities(data);
      } catch (err) {
        setError("Failed to load healthcare facilities.");
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  return {
    facilities,
    loading,
    error,
  };
};