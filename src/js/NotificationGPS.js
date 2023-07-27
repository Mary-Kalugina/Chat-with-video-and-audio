import ModalGPS from "./ModalGPS";

export default class NotificationGPS {
  constructor() {
    this.modal = new ModalGPS();
  }

  checkPermission() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (data) {
            const { latitude, longitude } = data.coords;
            resolve("[" + latitude + ", " + longitude + "]");
          },
          () => {
            reject("Geolocation request failed or was denied.");
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        reject("Geolocation is not supported in this browser.");
      }
    });
  }
}
