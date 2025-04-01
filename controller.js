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
  console.log(map);
  // let jsonURL = wpUploads.baseurl + "/testing.json";
  let jsonURL = "";
  let resultType = "ajax";
  let results = [];
  let mapMarkers = [];

  //make sure map is loaded. not sure this is necessary, but a little fail safe
  map.on("load", async () => {
    //initial markers fetch. Filtered Results are returned as a JSON obect
    if (resultType != "ajax") {
      results = await fetchMarkers(jsonURL, searchArgs);
    }
    //generate results list and map markers based on returned results
    mapMarkers = generateResults(map, results, mapMarkers, resultType);
  });
  //handle dropdown change
  const chapterSelect = document.querySelector("#chapter-select");
  if (chapterSelect) {
    selectFilter(jsonURL, searchArgs, map);
  }
  //handle search input
  let searchField = document.getElementById("chapter-search");
  if (searchField) {
    searchFilter(jsonURL, searchArgs, map);
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  // Select the node that will be observed for mutations
  // this will target whatever your results wrapper is
  const targetNode = document.getElementById("map-results-list");

  // Options for the observer (which mutations to observe)
  // if you're loading all elements on page load, you can use attributes to trigger filter updates.
  // else if you're using ajax, childList will trigger when results list is updated.
  const config = { attributes: true, childList: true, subtree: true };

  // // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        console.log("A child node has been added or removed.");
        mapMarkers = generateResults(map, results, mapMarkers, resultType);
      }
    }
  };

  // // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});

function searchFilter(jsonURL, searchArgs, map, mapMarkers) {
  const searchSubmit = document.getElementById("submit-chapter-search");
  let searchField = document.getElementById("chapter-search");

  searchSubmit.addEventListener("click", async function (e) {
    e.preventDefault();
    let chapterInput = searchField.value;
    searchArgs.search = chapterInput;

    let results = await fetchMarkers(jsonURL, searchArgs);
    mapMarkers = generateResults(map, results, mapMarkers, resultType);
  });
}

function selectFilter(jsonURL, searchArgs, map, mapMarkers) {
  const chapterSelect = document.querySelector("#chapter-select");
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
    mapMarkers = generateResults(map, results, mapMarkers, resultType);

    return searchArgs;
  });
}
