// return long and lat from a zip code
// this function is called in mapFilters.js
export async function zipCodeGeocode(search, accessToken) {
  const geoLatLng = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?country=US&access_token=${accessToken}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      try {
        if (data.features[0].center[0]) {
          // noResults.classList.remove("active-no-results");
          return [data.features[0].center[0], data.features[0].center[1]];
        }
      } catch (err) {
        // noResults.classList.add("active-no-results");
        return err;
      }
    });

  var zipLng = geoLatLng[0];
  var zipLat = geoLatLng[1];
  return [zipLng, zipLat];
}
