<?php
/**
 * Theme Functions and Setup
 */

// --- 1. Register Custom Post Type for Pet Transport Requests ---

function pet_transport_register_post_type() {
    $labels = array(
        'name'                  => _x( 'Pet Transport Requests', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Pet Transport Request', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Pet Requests', 'text_domain' ),
        'name_admin_bar'        => __( 'Pet Request', 'text_domain' ),
        'archives'              => __( 'Request Archives', 'text_domain' ),
        'attributes'            => __( 'Request Attributes', 'text_domain' ),
        'parent_item_colon'     => __( 'Parent Request:', 'text_domain' ),
        'all_items'             => __( 'All Requests', 'text_domain' ),
        'add_new_item'          => __( 'Add New Request', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Request', 'text_domain' ),
        'edit_item'             => __( 'Edit Request', 'text_domain' ),
        'update_item'           => __( 'Update Request', 'text_domain' ),
        'view_item'             => __( 'View Request', 'text_domain' ),
        'view_items'            => __( 'View Requests', 'text_domain' ),
        'search_items'          => __( 'Search Request', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
        'featured_image'        => __( 'Featured Image', 'text_domain' ),
        'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
        'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
        'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
        'insert_into_item'      => __( 'Insert into request', 'text_domain' ),
        'uploaded_to_this_item' => __( 'Uploaded to this request', 'text_domain' ),
        'items_list'            => __( 'Requests list', 'text_domain' ),
        'items_list_navigation' => __( 'Requests list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter requests list', 'text_domain' ),
    );
    $args = array(
        'label'                 => __( 'Pet Transport Request', 'text_domain' ),
        'description'           => __( 'Post Type for Pet Transport Form Submissions', 'text_domain' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'custom-fields' ),
        'taxonomies'            => array(),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-airplane',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true, // Important for REST API access
    );
    register_post_type( 'pet_request', $args );
}
add_action( 'init', 'pet_transport_register_post_type', 0 );


// --- 2. Register Custom REST API Endpoint ---

function pet_transport_register_rest_route() {
    register_rest_route( 'pet-transport/v1', '/request', array(
        'methods' => 'POST',
        'callback' => 'pet_transport_handle_form_submission',
        'permission_callback' => '__return_true' // Anyone can submit. For production, you might want to add nonce verification.
    ) );
}
add_action( 'rest_api_init', 'pet_transport_register_rest_route' );


// --- 3. Callback Function to Handle Form Submission ---

function pet_transport_handle_form_submission( WP_REST_Request $request ) {
    $params = $request->get_json_params();

    // Basic validation
    if ( empty( $params['pets'] ) || ! is_array( $params['pets'] ) ) {
        return new WP_Error( 'invalid_payload', 'No pet data provided.', array( 'status' => 400 ) );
    }

    // --- 1. Generate Rich HTML Content for Post and Email ---
    $post_content = '';

    // Departure & Destination
    $post_content .= "<h2>Departure &amp; Destination</h2>";
    $post_content .= "<strong>Departure Address:</strong> " . sanitize_text_field($params['departure-address']) . "<br>";
    $post_content .= "<strong>Departure Country:</strong> " . sanitize_text_field($params['departure-country']) . "<br>";
    $post_content .= "<strong>Destination Address:</strong> " . sanitize_text_field($params['destination-address']) . "<br>";
    $post_content .= "<strong>Destination Country:</strong> " . sanitize_text_field($params['destination-country']) . "<br>";
    $post_content .= "<strong>Proposed Departure Date:</strong> " . sanitize_text_field($params['departure-date']) . "<br><hr>";

    // Pets
    $post_content .= "<h2>Pets</h2>";
    foreach ($params['pets'] as $index => $pet) {
        $post_content .= "<h4>Pet " . ($index + 1) . "</h4>";
        $post_content .= "<ul>";
        $post_content .= "<li><strong>Type:</strong> " . sanitize_text_field($pet['animal_type']) . "</li>";
        $post_content .= "<li><strong>Breed:</strong> " . sanitize_text_field($pet['breed']) . "</li>";
        $post_content .= "<li><strong>Age:</strong> " . sanitize_text_field($pet['age']) . "</li>";
        $post_content .= "<li><strong>Weight:</strong> " . sanitize_text_field($pet['weight']) . "</li>";
        $post_content .= "</ul>";
    }
    $post_content .= "<hr>";

    // Travel Conditions
    if (!empty($params['travel-option'])) {
        $post_content .= "<h2>Travel Conditions</h2>";
        $post_content .= "<strong>Travel Option:</strong> " . sanitize_text_field($params['travel-option']) . "<br>";
        if ($params['travel-option'] === 'alone' && !empty($params['context'])) {
            $post_content .= "<strong>Context:</strong> " . sanitize_text_field($params['context']) . "<br>";
            if ($params['context'] === 'others' && !empty($params['other-means'])) {
                $post_content .= "<strong>Other Means:</strong> " . sanitize_text_field($params['other-means']) . "<br>";
            }
        }
        $post_content .= "<hr>";
    }
    
    // Additional Information
    $post_content .= "<h2>Additional Information</h2>";
    $post_content .= wpautop(sanitize_textarea_field($params['additional-info']));

    // --- 2. Create the Post ---
    $post_title = 'Pet Transport Request - ' . date('Y-m-d H:i:s');
    $post_data = array(
        'post_title'    => $post_title,
        'post_content'  => $post_content,
        'post_status'   => 'publish',
        'post_type'     => 'pet_request',
    );
    $post_id = wp_insert_post( $post_data );

    if ( is_wp_error( $post_id ) ) {
        return $post_id; // Return the WP_Error object
    }

    // --- 3. Send Email Notification ---
    $to = 'gilbert@blablabla-agency.com';
    $subject = $post_title;
    $body = $post_content;
    $headers = array('Content-Type: text/html; charset=UTF-8');
    wp_mail( $to, $subject, $body, $headers );

    // --- 4. Save form data as post meta (for structured data access) ---
    $pets = $params['pets'];
    $sanitized_pets = array();
    foreach ( $pets as $pet ) {
        $sanitized_pets[] = array(
            'animal_type' => sanitize_text_field( $pet['animal_type'] ),
            'breed'       => sanitize_text_field( $pet['breed'] ),
            'age'         => sanitize_text_field( $pet['age'] ),
            'weight'      => sanitize_text_field( $pet['weight'] ),
        );
    }
    update_post_meta( $post_id, 'pets_data', $sanitized_pets );

    $meta_fields = [
        'departure_address', 'departure_country', 'destination_address', 'destination_country',
        'departure_date', 'travel_option', 'context', 'other_means', 'additional_info'
    ];
    foreach( $meta_fields as $field ) {
        if ( isset( $params[ $field ] ) ) {
            $key_name = str_replace( '-', '_', $field );
            $value = is_array( $params[ $field ] ) ? $params[ $field ] : sanitize_text_field( $params[ $field ] );
            update_post_meta( $post_id, $key_name, $value );
        }
    }

    // --- 5. Return a success response ---
    $response_data = array(
        'success' => true,
        'message' => 'Request submitted successfully.',
        'post_id' => $post_id
    );

    return new WP_REST_Response( $response_data, 200 );
}
?>