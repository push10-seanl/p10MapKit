import { initializeMap } from "./js/initializeMap.js";
import { fetchMarkers } from "./js/fetchMarkers.js";
import { generateResults } from "./js/generateResults.js";

document.addEventListener("DOMContentLoaded", async function () {
  console.log("ran");
  const accessToken = document.getElementById("mapWrapper").dataset.accesstoken;
  const mapStyles = document.getElementById("mapWrapper").dataset.mapstyles;
  const mapArgs = { zoom: 3.5 };
  let searchArgs = { chapter: "all", search: "" };

  //initialize map, save map instance to variable
  let map = initializeMap(accessToken, mapStyles, mapArgs);
  let jsonURL = wpUploads.baseurl + "/testing.json";
  let results = "";
  let mapMarkers = [];

  //make sure map is loaded. not sure this is necessary, but a little fail safe
  map.on("load", async () => {
    //initial markers fetch. Filtered Results are returned as a JSON obect
    results = await fetchMarkers(jsonURL, searchArgs);
    //generate results list and map markers based on returned results
    mapMarkers = generateResults(map, results);
  });
  //handle dropdown change
  selectFilter(jsonURL, searchArgs, map);
  //handle search input
  searchFilter(jsonURL, searchArgs, map);
});

function searchFilter(jsonURL, searchArgs, map, mapMarkers) {
  const searchSubmit = document.getElementById("submit-chapter-search");
  let searchField = document.getElementById("chapter-search");

  searchSubmit.addEventListener("click", async function (e) {
    e.preventDefault();
    let chapterInput = searchField.value;
    searchArgs.search = chapterInput;

    let results = await fetchMarkers(jsonURL, searchArgs);
    mapMarkers = generateResults(map, results);
  });
}

function selectFilter(jsonURL, searchArgs, map, mapMarkers) {
  const chapterSelect = jQuery("#chapter-select");
  let markers = document.querySelectorAll(".marker");
  let listMarkers = document.querySelectorAll(".single-mod-marker");

  // Initialize Select2 on the chapterSelect element
  chapterSelect.select2({
    minimumResultsForSearch: -1,
    dropdownParent: jQuery(chapterSelect).parent(),
  });

  // Bind the change event to the Select2 instance
  chapterSelect.on("change", async function (e) {
    console.log("changed");
    let chapterType = e.target.value;
    //clear values
    markers.forEach((marker) => {
      marker.remove();
    });
    listMarkers.forEach((marker) => {
      marker.remove();
    });
    console.log(searchArgs);
    searchArgs.chapter = chapterType;
    console.log(searchArgs);

    let results = await fetchMarkers(jsonURL, searchArgs);
    mapMarkers = generateResults(map, results);

    return searchArgs;
  });
}
