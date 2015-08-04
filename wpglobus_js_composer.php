<?php
/**
 * Plugin Name: WPGlobus for WPBakery Visual Composer
 * Plugin URI: https://github.com/WPGlobus/wpglobus-for-wpbakery-visual-composer
 * Description: WPGlobus add-on for WPBakery Visual Composer 
 * Domain Path: 
 * Version: 1.0.0
 * Author: WPGlobus
 * Author URI: http://www.wpglobus.com/
 * Network: false
 * License: GPL2
 * Credits: Alex Gor (alexgff) and Gregory Karpinsky (tivnet)
 * Copyright 2015 WPGlobus
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as
 * published by the Free Software Foundation.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */ 
 
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
 
define( 'WPGLOBUS_JS_COMPOSER_VERSION', '1.0.0' ); 
 
add_action( 'plugins_loaded', 'wpglobus_js_composer_load', 11 );
function wpglobus_js_composer_load() {
	
	if ( defined( 'WPGLOBUS_VERSION' ) ) :

		add_filter( 'tiny_mce_before_init', 'wpglobus_js_composer_tiny_mce_before_init' );
		function wpglobus_js_composer_tiny_mce_before_init($mceInit) {
			
			$mceInit['setup'] = "function(editor) {
				editor.on('change', function(e) {
					WPGlobusJsComposer.change(e, editor);
				});
			}";

			return $mceInit;
			
		}

		add_action( 'admin_print_scripts', 'wpglobus_js_composer_admin_enqueue_scripts' );
		function wpglobus_js_composer_admin_enqueue_scripts() {

			global $post;
			
			if ( ! is_admin() ) {
				return;	
			}	

			if ( empty( $post ) ) {
				return;	
			}			
			
			$content_types_option = 'wpb_js_content_types';

			$content_types = get_option( $content_types_option );
			
			if ( ! empty( $content_types ) && in_array( $post->post_type, $content_types ) ) :
			
				$wpglobus_composer_script_suffix = '.min';	
				if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
					$wpglobus_composer_script_suffix = '';	
				}	
				
				wp_register_script(
					'wpglobus-js-composer',
					plugin_dir_url( __FILE__ ) . 'wpglobus_js_composer' . $wpglobus_composer_script_suffix . ".js",
					array( 'jquery' ),
					WPGLOBUS_JS_COMPOSER_VERSION,
					true
				);
				wp_enqueue_script( 'wpglobus-js-composer' );
				
			endif;	

		}	

	endif;
	
}	