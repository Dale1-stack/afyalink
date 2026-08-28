import {
  useEffect,
  useState,
} from "react";

import {
  getFacilities,
} from "../services/facilityApi";


export const useFacilities = () => {

  const [
    facilities,
    setFacilities
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState(null);


  const loadFacilities = async () => {

    try {

      setLoading(true);
      setError(null);

      const data =
        await getFacilities();

      setFacilities(data);

    } catch (err) {

      console.error(
        "Failed to load facilities:",
        err
      );

      setError(
        err.message ||
        "Failed to load healthcare facilities."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadFacilities();

  }, []);


  return {
    facilities,
    loading,
    error,
    refresh: loadFacilities,
  };
};