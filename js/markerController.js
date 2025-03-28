//results list click events
export function initializeMarkerController(map) {
  const markers = document.querySelectorAll(".single-mod-marker");
  const mapMarkers = document.querySelectorAll(".map-marker");

  markers.forEach((marker) => {
    marker.addEventListener("click", function (e) {
      markers.forEach((marker) => {
        marker.classList.remove("active");
      });
      e.stopPropagation();
      console.log("clicked");
      const markerID = this.getAttribute("data-id");
      console.log("this marker ID: " + markerID);
      const mapMarkers = document.querySelectorAll(".map-marker");
      marker.classList.add("active");
      mapMarkers.forEach((mapMarker) => {
        console.log("each marker ID: " + mapMarker.getAttribute("data-id"));
        if (mapMarker.getAttribute("data-id") === markerID) {
          console.log("match");
          mapMarker.classList.add("active-marker");
          mapMarker.classList.add("active-marker-selected");
          const long = mapMarker.getAttribute("data-lng");
          const lat = mapMarker.getAttribute("data-lat");
          const cords = [long, lat];
          map.flyTo({
            center: cords,
            zoom: 10,
            curve: 1,
            speed: 3.5,
            essential: true,
            easing: function (t) {
              return t;
            },
          });
        } else {
          mapMarker.classList.remove("active-marker");
        }
      });
    });
  });

  mapMarkers.forEach((mapMarker) => {
    mapMarker.addEventListener("click", function (e) {
      mapMarkers.forEach((marker) => {
        marker.classList.remove("active-marker");
      });
      this.classList.add("active-marker");
      let markerListing = document.querySelector(
        '.single-mod-marker[data-id="' + this.getAttribute("data-id") + '"]'
      );
      markerListing.classList.add("active");
      const long = mapMarker.getAttribute("data-lng");
      const lat = mapMarker.getAttribute("data-lat");
      const cords = [long, lat];
      map.flyTo({
        center: cords,
        zoom: 10,
        curve: 1,
        speed: 3.5,
        essential: true,
        easing: function (t) {
          return t;
        },
      });
    });
  });
}
