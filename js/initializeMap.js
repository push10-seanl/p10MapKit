//intialize mapbox map on page load
export function initializeMap(accessToken, mapStyles, mapArgs = {}) {
  mapboxgl.accessToken = accessToken;

  //there are more options than this
  const map = new mapboxgl.Map({
    container: "map",
    zoom: mapArgs?.zoom ?? 2.5,
    minzoom: mapArgs?.minzoom ?? 3.5,
    maxzoom: mapArgs?.maxzoom ?? 12,
    center: mapArgs?.center ?? [-81.082944, 35.444476],
    style: mapStyles,
  });

  // if you want built-in search
  // map.addControl(
  //   new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl,
  //   })
  // );

  map.addControl(
    new mapboxgl.NavigationControl({
      showCompass: false,
    })
  );
  map.scrollZoom.disable();
  return map;
}
