<?php

// this is an example of the front-end

$accessToken =  '{your token here'; //get_field('mapbox_api_key', 'options'); // Custom Access Token, not necessary
$mapStyles =  '{your mapbox styles here}'; //get_field('mapbox_style', 'options'); // Custom Styles, not necessary
?>
<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js" integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==" crossorigin=""></script>

<script src='https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js'></script>
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css' rel='stylesheet' />
<script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js'></script>
<link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css' type='text/css' />

<section id="mapWrapper" class="p10-section map-section impact-map" data-accessToken="<?= $accessToken; ?>" data-mapStyles="<?= $mapStyles; ?>">
    <div id="map"></div>
    <div id="map-key">
        <p class="small-label"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#B0894F" />
            </svg>Collegiate Chapters</p>
        <p class="small-label"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill="#0056A3" />
            </svg>Alumnae Chapters</p>
    </div>
    <div id="map-results">
        <form>
            <h1>Find a Chapter or Group</h1>
            <input id="chapter-search" class="body-sm" type="text" placeholder="Enter zipcode, state, or school" />
            <button class="p10-btn dgPink" id="submit-chapter-search" type="submit">Search</button>
            <label class="bold-label-large">Filter By
                <select id="chapter-select" class="chapter-finder-filter">
                    <option value="all">All Chapters</option>
                    <option value="collegiate">Collegiate Chapters</option>
                    <option value="alumnae">Alumnae Chapters</option>
                </select>
            </label>
        </form>
        <div id="map-results-list">
            <?php
            $marker_id = 1;
            foreach ($chapter_json as $chapter) {
                echo '<a href="javascript:void(0)" class="chapter map-result single-mod-marker active-type" data-lat="' . $chapter['coords']['lat'] . '" data-lng="' . $chapter['coords']['lng'] . '" data-id="' . $marker_id . '" data-chapter="' . $chapter['type'] . '" data-zipcode="' . $chapter['zipcode'] . '">';
                echo '<span class="bold-label-small subheader">' . $chapter['type'] . ' Chapter</span>';
                echo '<h4>' . $chapter['name'] . '</h4>';
                echo '<p>School Name: ' . $chapter['school_name'] . '</p>';
                echo '<p>City: ' . $chapter['city'] . '</p>';
                echo '<p>State: ' . $chapter['state'] . '</p>';
                echo '<p>Website: ' . $chapter['website'] . '</p>';
                echo '</a>';
                $marker_id++;
            }
            ?>
        </div>
    </div>
</section>