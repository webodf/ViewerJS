<?php

/*
Plugin Name: WebODF Viewer
Version: @WEBODF_VERSION@
Plugin URI: http://webodf.org/
Description: Embed ODF in Wordpress
Author: Tobias Hintze
Author URI: http://kogmbh.com

This Wordpress plugin is free software: you can redistribute it
and/or modify it under the terms of the GNU Affero General Public License
(GNU AGPL) as published by the Free Software Foundation, either version 3 of
the License, or (at your option) any later version.  The code is distributed
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.

As additional permission under GNU AGPL version 3 section 7, you
may distribute non-source (e.g., minimized or compacted) forms of
that code without the copy of the GNU GPL normally required by
section 4, provided you include this license notice and a URL
through which recipients can access the Corresponding Source.

*/

$site_url = site_url();
$this_plugin_url = plugins_url() .'/'. plugin_basename(dirname(__FILE__));

function WebODF_ViewerAddPage() {
	add_options_page('WebODF-Viewer Options', 'WebODF-Viewer', '8', 'webodf-viewer.php', 'WebODF_ViewerOptions');
}

function WebODF_ViewerOptions() {
	global $site_url;
	$message = '';
	$options = get_option('WebODF_ViewerSettings');
	if ($_POST) {
		if (isset($_POST['width'])) {
			$options['width'] = $_POST['width'];
		}
		if (isset($_POST['height'])) {
			$options['height'] = $_POST['height'];
		}

		update_option('WebODF_ViewerSettings', $options);
		$message = '<div class="updated"><p>width=' . $options['width'] .
			' height=' . $options['height'] .'<strong>&nbsp; Options saved.</strong></p></div>';
	}
	echo '<div class="wrap">';
	echo '<h2>WebODF-Viewer Options</h2>';
	echo $message;
	echo '<form method="post" action="options-general.php?page=webodf-viewer.php">';
	echo "<p>You can adjut the width and height of the WebODF Viewer iframe here. This is a global setting.</p>";
	echo '<h4>Width-Height</h4>' . "\n";
	echo '<table class="form-table">' . "\n";
	echo '<tr><th scope="row">width</th><td>' . "\n";
	echo '<input type="text" name="width" value="' . $options['width'] . '" />';
	echo '</td></tr>' . "\n";
	echo '<tr><th scope="row">height</th><td>' . "\n";
	echo '<input type="text" name="height" value="' . $options['height'] . '" />';
	echo '</td></tr>' . "\n";
	echo '</table>' . "\n";

	echo '<p class="submit"><input class="button-primary" type="submit" method="post" value="Update Options"></p>';
	echo '</form>';

	echo '</div>';
}

function WebODF_ViewerLoadDefaults() {
	$ret = array();
	$ret['width'] = '450px';
	$ret['height'] = '380px';
	return $ret;
}

function WebODF_Viewer_activate() {
	update_option('WebODF_ViewerSettings', WebODF_ViewerLoadDefaults());
}

register_activation_hook(__FILE__,'WebODF_Viewer_activate');

function WebODF_Viewer_deactivate() {
	delete_option('WebODF_ViewerSettings');
}

register_deactivation_hook(__FILE__,'WebODF_Viewer_deactivate');

add_action('admin_menu', 'WebODF_ViewerAddPage');


function mime_type_filter($mime_types) {
    $mime_types['odt'] = 'application/vnd.oasis.opendocument.text';
    $mime_types['odp'] = 'application/vnd.oasis.opendocument.presentation';
    $mime_types['ods'] = 'application/vnd.oasis.opendocument.spreadsheet';
    return $mime_types;
}
add_filter( 'upload_mimes', 'mime_type_filter');

function mime_type_icon($icon_uri, $mime_type, $post_id) {
	// this is bogus and not implemented
	if ($mime_type === 'application/vnd.oasis.opendocument.text') {
		return $icon_uri;
	} else if ($mime_type === 'application/vnd.oasis.opendocument.presentation') {
		return $icon_uri;
	} else if ($mime_type === 'application/vnd.oasis.opendocument.spreadsheet') {
		return $icon_uri;
	} else {
		return $icon_uri;
	}
	// return array($this_plugin_url . '/odf.png', 64, 64);
}
add_filter( 'wp_mime_type_icon', 'mime_type_icon', 10, 3);

function webodf_media_send_to_editor($html, $send_id, $attachment) {
	$pid = $attachment['id'];

	$post = get_post($pid, ARRAY_A);
	if (preg_match('/^application\/vnd\.oasis\.opendocument/', $post['post_mime_type'])) {
			// place shortcode
			preg_match('/^http:\/\/[^\/]*(\/.*)$/', $attachment['url'], $matches);
			$document_url = $matches[1];
			return "[webodf_viewer ".$document_url."]";
	}
	return $html;
}
add_filter( 'media_send_to_editor', 'webodf_media_send_to_editor', 10, 3);


/*
	TODO: introduce a smart switch on [post | attachment] scope
		to skip webodf-embedding... (user might to simply link
		some documents)
		For now: always use webodf for embedding, if this plugin
		is enabled.

function field_filter($fields, $post_object) {
	if ($post_object->post_parent > 0) {
		// inside a post
		$use_webodf = get_post_meta($post_object['post_parent'], 'use_webodf');
	}

	if (preg_match('/^application\/vnd\.oasis\.opendocument\.(text|presentation|spreadsheet)/',
				$post_object->post_mime_type)) {

		// insert document path
		preg_match('/^http:\/\/[^\/]*(\/.*)$/', $post_object->guid, $matches);
		$fields["webodf_document_url"] = array(
			"label" => __("Document URL"),
			"input" => "text",
			"value" => $matches[1]
		);
		$fields["webodf_embed"] = array(
				"input" => "html",
				"label" => "Embed with WebODF",
				"html" => '<label for="attachments-'.$post_object->ID.'-webodf_embed"> '.
				'<input type="checkbox" id="attachments-"'.$post_object->ID.'-webodf_embed" '.
				' name="attachments['.$post_object->ID.'][webodf_embed]" value="1" checked="checked"/>Use WebODF?</label>'
				);
	}
	return $fields;
}
add_filter('attachment_fields_to_edit', 'field_filter', 10, 2);

function field_save_legacy( $post, $attachment ) {
	$postid = $post['post_ID'];
	if (! $postid) $postid = $post['ID'];
	return field_save($postid);
}

function field_save( $post ) {
	$postid = $post;

	if (! empty($_POST['attachments'])) {
		if ($_POST['attachments'][$postid]['webodf_embed']) {
			update_post_meta($postid, 'webodf_embed', "yes");
		} else {
			update_post_meta($postid, 'webodf_embed', "no");
		}
	}
	return $post;
}

// legacy (wp < 3.5.1):
add_filter('attachment_fields_to_save', 'field_save_legacy', 10, 2);

// recent:
add_filter('add_attachment', 'field_save', 10, 1);
add_filter('edit_attachment', 'field_save', 10, 1);

*/

function webodf_shortcode_handler($args) {
	global $this_plugin_url;
	$document_url = $args[0];
	$options = get_option('WebODF_ViewerSettings');
	$iframe_width = $options['width'];
	$iframe_height = $options['height'];
	return "<iframe src=\"$this_plugin_url/wv/" .
		'#' . $document_url .'" '.
			"width=\"$iframe_width\" ".
			"height=\"$iframe_height\" ".
			'style="border: 1px solid black; border-radius: 5px;" '.
			'webkitallowfullscreen="true" '.
			'mozallowfullscreen="true"></iframe>';
}
add_shortcode('webodf_viewer', 'webodf_shortcode_handler');

?>
