<?php
// this custom wpdb query can be used to implement the haversine formula on custom posts while filtering results
//this can be used if you are returning results via custom ajax, or 
//if you are using something like ALM or facetWP (alm_query_args hook for alm, unsure about facetWP))

// this will have to be modified to include the correct tax query for each instance, 
// if there are also  secondary filters


//TODO: add option to switch between either google maps or mapbox key (or just use mapbox for all)
//TODO: provide example alm and facetwp integration 

function get_lat_lng_from_zip($zip_code)
{
    $api_key = 'YOUR_GOOGLE_MAPS_API_KEY';
    $url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($zip_code) . "&key=" . $api_key;

    $response = wp_remote_get($url);
    if (is_wp_error($response)) {
        return false;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);
    if (!empty($data['results'][0]['geometry']['location'])) {
        return $data['results'][0]['geometry']['location']; // Returns ['lat' => ..., 'lng' => ...]
    }

    return false;
}

function get_posts_within_radius($zip_code, $radius = 50)
{
    global $wpdb;

    // Get latitude and longitude of the zip code
    $location = get_lat_lng_from_zip($zip_code);
    if (!$location) {
        return [];
    }

    $lat = $location['lat'];
    $lng = $location['lng'];

    // Haversine formula to calculate distance
    $haversine = "
        ( 6371 * acos( cos( radians(%f) ) * cos( radians( lat.meta_value ) ) * cos( radians( lng.meta_value ) - radians(%f) ) + sin( radians(%f) ) * sin( radians( lat.meta_value ) ) ) )
    ";

    $query = $wpdb->prepare("
        SELECT p.ID
        FROM {$wpdb->posts} AS p
        INNER JOIN {$wpdb->postmeta} AS lat ON p.ID = lat.post_id AND lat.meta_key = 'latitude'
        INNER JOIN {$wpdb->postmeta} AS lng ON p.ID = lng.post_id AND lng.meta_key = 'longitude'
        WHERE p.post_status = 'publish'
        AND p.post_type = 'your_post_type'
        HAVING $haversine < %d
        ORDER BY $haversine ASC
    ", $lat, $lng, $lat, $radius);

    $post_ids = $wpdb->get_col($query);

    if (!empty($post_ids)) {
        return new WP_Query([
            'post__in' => $post_ids,
            'post_type' => 'your_post_type',
            'posts_per_page' => -1,
        ]);
    }

    return [];
}
