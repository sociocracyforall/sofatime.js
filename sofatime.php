<?php
/**
 * Plugin Name: SoFA Time
 * Description: Uses a shortcode to identify time and date strings and change them to the client's local time zone.
 * Author: SociocracyForAll, Vernon Coffey
 * Version: 0.2.0
 */

add_action('wp_enqueue_scripts', 'sofatime_script_enqueue');
add_action('init', 'sofatime_register_shortcodes');

function sofatime_script_enqueue() {
  $dir_url = plugin_dir_url(__FILE__);
  $dir_path = plugin_dir_path(__FILE__);
  $sofatime_path = "wordpress/main.bundle.js";
  wp_enqueue_script('sofatime', $dir_url . $sofatime_path, array(),
                    filemtime($dir_path . $sofatime_path));
  wp_enqueue_style('sofatime-css', $dir_url . "sofatime.css", array(),
                   filemtime($dir_path . "sofatime.css"));
}

function sofatime_register_shortcodes() {
  add_shortcode('sofatime', 'sofatime_shortcode_function');
  add_filter('no_texturize_shortcodes', 'exempt_sofatime_shortcode');
}

function exempt_sofatime_shortcode($shortcodes) {
  $shortcodes[] = 'sofatime';
  return $shortcodes;
}

function sofatime_shortcode_function($atts, $content = null) {
  $allowed_attributes = array(
    'ask-twenty-four',    // This and the next one mean the same thing...
    'display-24h-toggle', // ... this one is kept for legacy purposes and is
                          // deprecated.
    'allow-time-zone-select',  // This and the next one mean the same thing...
    'display-select',     // ... this one is kept for legacy purposes and is
                          // deprecated.
    'format',
    'display-times-only',
    'prominent-controls',
  );

  $atts = (array) $atts;
  $inline = array_key_exists('inline', $atts)
    && ($atts['inline'] === 'yes' || $atts['inline'] === 'true');
  $elementName = $inline ? 'span' : 'div';

  $out = '<' . $elementName . ' class="sofatime" data-sofatime="'
         . htmlspecialchars($content) . '"';
  foreach($atts as $key => $value) {
    if(in_array($key, $allowed_attributes)) {
      $out .= ' data-' . strtolower($key) . '="'
              . htmlspecialchars($value) . '"';
    }
  }
  if(!in_array('prominent-controls', $atts)) {
    $out .= ' data-prominent-controls="true"';
  }
  $out .= '></' . $elementName . '>';
  if (!$inline) {
    $out .= "\n";
  }

  return $out;
}
