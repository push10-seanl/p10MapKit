<?php
// include(__DIR__ . "/radiusSearch.php");

function get_lat_lng_from_zip($zip_code)
{
    error_log(print_r('get_lat_lng_From_zip ran', true), 3, __DIR__ . '/getlatlng.log');
    error_log(print_r('zipcode: ' . $zip_code, true), 3, __DIR__ . '/getlatlngzipcode.log');
    $accessToken = '{mapbox access token}';
    $url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" . urlencode($zip_code) . ".json?country=US&access_token=" . urlencode($accessToken);
    error_log(print_r('url: ' . $url, true), 3, __DIR__ . '/getlatlngurl.log');

    // $url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($zip_code) . "&key=" . $api_key;

    $response = wp_remote_get("$url", [
        'blocking' => true,
    ]);
    if (is_wp_error($response)) {
        error_log(print_r('Error fetching location data: ' . $response, true), 3, __DIR__ . '/geocodeerror.log');
        return false;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);
    error_log(print_r('data: ' . print_r($data, true), true), 3, __DIR__ . '/geocodedata.log');
    if (!empty($data['features'][0]['geometry']['coordinates'])) {
        error_log(print_r('Location data: ' . print_r($data['features'][0]['geometry']['coordinates'], true), true), 3, __DIR__ . '/geocodeResponse.log');
        return $data['features'][0]['geometry']['coordinates']; // Returns ['lat' => ..., 'lng' => ...]
    } else {
        error_log(print_r('No location data found for zip code: ' . $zip_code, true), 3, __DIR__ . '/geocodenofound.log');
        return false;
    }
}

//https://connekthq.com/plugins/ajax-load-more/docs/filter-hooks/#alm_query_args
// modifies the alm query to run a radius search on custom post type with lat and lng values (google maps or mapbox field)
function alm_radius_search($args, $id)
{
    if (array_key_exists('s', $args)) {

        if (is_numeric($args['s'])) {
            error_log(print_r('is_numeric', true), 3, __DIR__ . '/debugnumeric.log');
            try {

                $args['custom_query_flag'] = true;
                $coords = get_lat_lng_from_zip($args['s']);
                $args['lat'] = $coords[1];
                $args['lng'] = $coords[0];
                $args['posts_per_page'] = -1;
                $args['radius'] = 50; // Set a default radius (in miles)
                add_filter('posts_where', 'apply_haversine_formula', 10, 2);
            } catch (Exception $e) {
                return $args;
            }
        }
    }
    return $args;
}
add_filter('alm_query_args_mapresults', 'alm_radius_search', 10, 2);



// Add a posts_where filter to apply the Haversine formula


// the simplest way to do this is to create lat and lng fields in the custom post type
// save_post action below will extract lat and lng from the google maps field and save them to lat and lng acf fields
function apply_haversine_formula($where, $query)
{
    global $wpdb;

    if ($query->get('custom_query_flag')) {
        $lat = $query->get('lat'); // Latitude of the center point
        $lng = $query->get('lng'); // Longitude of the center point
        $radius = $query->get('radius'); // Radius in miles

        if ($lat && $lng && $radius) {
            $where = " AND {$wpdb->posts}.ID IN (
                SELECT lat_meta.post_id
                FROM {$wpdb->postmeta} AS lat_meta
                INNER JOIN {$wpdb->postmeta} AS lng_meta
                ON lat_meta.post_id = lng_meta.post_id
                WHERE lat_meta.meta_key = 'lat'
                AND lng_meta.meta_key = 'lng'
                AND (
                    3959 * acos(
                        cos(radians(%f)) * cos(radians(CAST(lat_meta.meta_value AS DECIMAL(10, 6)))) *
                        cos(radians(CAST(lng_meta.meta_value AS DECIMAL(10, 6))) - radians(%f)) +
                        sin(radians(%f)) * sin(radians(CAST(lat_meta.meta_value AS DECIMAL(10, 6))))
                    )
                ) <= %d
            )";

            // Use $wpdb->prepare to safely insert the values
            $where = $wpdb->prepare(
                $where,
                $lat,  // Latitude of the center point
                $lng,  // Longitude of the center point
                $lat,  // Latitude again for the Haversine formula
                $radius // Radius in miles
            );
        }
    }

    return $where;
}


add_action('save_post', 'save_lat_lng_fields', 10, 2);
function save_lat_lng_fields($post_id, $post)
{
    // Check if this is the correct post type
    if ($post->post_type !== 'chapters') {
        return;
    }

    // Get the latitude and longitude from the Google Maps field
    $location = get_field('location', $post_id);
    if ($location) {
        update_post_meta($post_id, 'lat', $location['lat']);
        update_post_meta($post_id, 'lng', $location['lng']);
    }
}


// function resave_all_chapters_posts()
// {
//     // Get all 'chapters' posts
//     $args = [
//         'post_type'      => 'chapters',
//         'post_status'    => 'publish', // Only published posts
//         'posts_per_page' => -1,        // Get all posts
//         'fields'         => 'ids',    // Only retrieve post IDs
//     ];

//     $chapter_posts = get_posts($args);

//     if (!empty($chapter_posts)) {
//         foreach ($chapter_posts as $post_id) {
//             // Re-save the post to trigger the save_post action
//             wp_update_post([
//                 'ID' => $post_id,
//             ]);
//         }

//         echo count($chapter_posts) . " chapter posts have been re-saved.";
//     } else {
//         echo "No chapter posts found.";
//     }
// }

// add_action('init', function () {
//     // if (isset($_GET['resave_chapters']) && current_user_can('manage_options')) {
//     resave_all_chapters_posts();
//     // exit('All chapter posts have been re-saved.');
//     // }
// });
