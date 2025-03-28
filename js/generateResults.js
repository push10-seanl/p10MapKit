import { initializeMarkerController } from "./markerController.js";

//TODO: complete updating for map markers,  add initializeMarkerController

//generate map markers from JSON object containing all results
export function generateResults(map, results = [], mapMarkers = []) {
  if (!map || !map.getCanvasContainer) {
    console.error("Map instance is not valid.");
    return;
  }
  let mapResults = document.getElementById("map-results-list");
  //reset results
  mapResults.innerHTML = "";
  let markers = document.querySelectorAll(".map-marker");
  mapMarkers.forEach((marker) => {
    marker.remove();
  });
  markers.forEach((marker) => {
    marker.remove();
  });

  console.log(results);
  let resultID = 1;
  results.forEach((result) => {
    console.log(result);
    let resultElem = document.createElement("a");
    resultElem.setAttribute("data-lat", result.coords.lat);
    resultElem.setAttribute("data-lng", result.coords.lng);
    resultElem.setAttribute("data-id", resultID);
    resultElem.setAttribute("data-chapter", result.type);
    resultElem.setAttribute("data-city", result.city);
    resultElem.setAttribute("data-state", result.state);
    resultElem.setAttribute("data-name", result.name);
    resultElem.setAttribute("data-zipcode", result.zipCode);
    resultElem.setAttribute("data-schoolname", result.school_name);
    resultElem.className = "chapter map-result single-mod-marker";
    resultElem.innerHTML = `
    <span class="bold-label-small subheader">${result.type}</span>
    <h4>${result.name}</h4>
    <p>School Name: ${result.school_name}</p>
    <p>City: ${result.city}</p>
    <p>State: ${result.state}</p>
    <p>Website: ${result.website}</p>
    `;
    resultElem.href = "javascript:void(0);";
    mapResults.appendChild(resultElem);
    resultID++;
  });

  // this exepcts a list of elements with the class single-mod-marker, which have data-lat and data-long attributes
  // const markers = document.querySelectorAll(".single-mod-marker");

  // mapMarkers = mapMarkers.length > 0 ? mapMarkers : [];
  // console.table(mapMarkers);

  mapResults = document.querySelectorAll(".map-result");
  mapResults.forEach((marker) => {
    const lat = marker.getAttribute("data-lat");
    const long = marker.getAttribute("data-lng");
    const dataID = marker.getAttribute("data-id");
    const chapterType = marker.getAttribute("data-chapter");
    var cords = [long, lat];
    var zipCode = marker.getAttribute("data-zipcode");
    // required attributes could be made dynamic
    // by creating a function that takes an object of attributes
    // and returns an element with those attributes

    // generate marker
    const el = document.createElement("a");
    var href = document.createAttribute("href");
    var latAtt = document.createAttribute("data-lat");
    var lngAtt = document.createAttribute("data-lng");
    var chapterTypeAtt = document.createAttribute("data-chapter");
    var id = document.createAttribute("data-id");
    var zipCodeAtt = document.createAttribute("data-zipcode");
    var bgImg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="52" viewBox="0 0 32 52" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.259 0.0519691C16.8661 0.0216971 16.4686 0.00504744 16.0696 0.00050663C15.6692 -0.00252058 15.2732 0.00807464 14.8788 0.0307787C3.3953 0.707359 -3.39014 13.3036 1.73269 23.5855L14.2842 50.626C14.8348 51.7294 16.4079 51.743 16.9768 50.6487L29.9955 23.8292C35.2958 13.6366 28.7273 0.925318 17.259 0.0519691Z" fill="#00205B"/><path d="M22.5042 18.1181L20.265 19.976L21.1265 20.1694C20.6063 21.1782 19.8504 22.4519 18.363 22.4519C17.7331 22.4519 17.282 22.1828 16.965 21.7373C16.965 21.7373 16.9651 21.7331 16.961 21.7289C16.6237 21.2581 16.4408 20.6822 16.4408 20.0811L16.4286 13.818H19.9277V12.3678H16.4286V11.5439C17.152 11.1572 17.6559 10.3375 17.6559 9.39176C17.6559 8.07188 16.6806 7 15.4858 7C14.291 7 13.3156 8.07188 13.3156 9.39176C13.3156 10.3375 13.8155 11.153 14.5429 11.5439V12.3678H11.0439V13.818H14.5429L14.5551 20.0811C14.5551 20.678 14.3682 21.2581 14.035 21.7289C14.035 21.7289 14.035 21.7331 14.0309 21.7373C13.7098 22.1828 13.2587 22.4519 12.6329 22.4519C11.1455 22.4519 10.3896 21.1782 9.86941 20.1694L10.731 19.976L8.49174 18.1181L8 21.0984L8.8453 20.5309C9.08101 21.1572 9.56462 21.9937 10.4343 22.8806C10.8326 23.2884 12.0558 24.0114 12.6573 24.272C14.799 25.2009 15.4939 27 15.4939 27H15.5061C15.5061 27 16.201 25.2009 18.3427 24.272C18.9442 24.0114 20.1715 23.2884 20.5657 22.8806C21.4313 21.9937 21.9149 21.153 22.1547 20.5309L23 21.0984L22.5083 18.1181H22.5042ZM15.4858 10.5561C14.9087 10.5561 14.4373 10.0391 14.4373 9.40017C14.4373 8.76124 14.9087 8.24422 15.4858 8.24422C16.0629 8.24422 16.5343 8.76124 16.5343 9.40017C16.5343 10.0391 16.0629 10.5561 15.4858 10.5561Z" fill="#FABBCB"/></svg>';
    el.innerHTML += bgImg;

    latAtt.value = lat;
    lngAtt.value = long;
    id.value = dataID;
    chapterTypeAtt.value = chapterType;
    zipCodeAtt.value = zipCode;
    href.value = "javascript:void(0);";

    el.setAttributeNode(latAtt);
    el.setAttributeNode(lngAtt);
    el.setAttributeNode(href);
    el.setAttributeNode(id);
    el.setAttributeNode(chapterTypeAtt);
    el.setAttributeNode(zipCodeAtt);
    el.className = "map-marker";
    el.classList.add("active-type");

    const newMarker = new mapboxgl.Marker(el).setLngLat(cords).addTo(map);
    mapMarkers.push(newMarker);
  });
  // marker click events
  initializeMarkerController(map);

  return mapMarkers;
}
