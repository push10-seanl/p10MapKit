// import * as select2 from "../../assets/dist/blocks/select2.min.js";
import { zipCodeGeocode } from "./zipCodeGeocode.js";
import { radiusSearch } from "./radiusSearch.js";

//this funtion is where the variability comes into play. You can create your own function to fetch markers however you need
// The only thing that should remain the same in order for the rest of the code to work is that you generate your results as
// a list of elements with the class "single-mod-marker", and at the very least, each element should have the following attributes:
// data-lng, data-lat, data-id, data-name, data-state, data-zipcode

export async function fetchMarkers(baseURL = "", args = "") {
  const accessToken = document.getElementById("mapWrapper").dataset.accesstoken;
  if (baseURL != "") {
    let results = await fetch(baseURL);
    try {
      if (!results.ok) {
        throw new Error(`Response status: ${results.status}`);
      }
      let json = await results.json();
      if (args) {
        //   console.log("args", args);
        if (args?.chapter != "all") {
          json = json.filter((marker) => marker.type === args.chapter);
        }
        if (args?.search) {
          let search = args.search;
          if (!isNaN(parseFloat(search)) && isFinite(search)) {
            console.log("is numeric - treat as zipcode");
            let geoLatLng = await zipCodeGeocode(search, accessToken);
            var zipLng = geoLatLng[0];
            var zipLat = geoLatLng[1];

            json = json.filter((marker) => {
              return radiusSearch(marker, zipLat, zipLng);
            });
          } else {
            // TODO: if args.search is text, search for state or name matches
          }
        }
      } else {
      }
      console.log(json);
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }
}
