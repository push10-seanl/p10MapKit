// expects a single object input
// dang, math! haversine formula to determine coordinates that fall within a certain radius around the submitted zipcode
// if the coordinates fall within the radius, return true
// if the coordinates fall outside the radius, return false
export function radiusSearch(result, zipLat, zipLng) {
  const lat = result.coords.lat;
  const lng = result.coords.lng;

  // console.log("zipLat", zipLat);
  // console.log("zipLng", zipLng);

  var lat2 = lat;
  var lon2 = lng;
  var lat1 = zipLat;
  var lon1 = zipLng;

  var R = 6371; // km
  var x1 = lat2 - lat1;
  var dLat = x1 * (Math.PI / 180);
  var x2 = lon2 - lon1;
  var dLon = x2 * (Math.PI / 180);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  //  console.log(d / 1.60934);
  if (d / 1.60934 < 50) {
    console.log("within 50 miles");
    return true;
  } else {
    console.log("outside 50 miles");
    return false;
  }
}
