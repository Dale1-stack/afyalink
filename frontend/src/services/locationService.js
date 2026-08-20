export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Geolocation is not supported by this browser."
        )
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

          accuracy:
            position.coords.accuracy,
        });
      },

      (error) => {
        let message =
          "Unable to determine your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location permission was denied.";
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              "Your location is currently unavailable.";
            break;

          case error.TIMEOUT:
            message =
              "The location request timed out.";
            break;

          default:
            break;
        }

        reject(new Error(message));
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 300000,
      }
    );
  });
};