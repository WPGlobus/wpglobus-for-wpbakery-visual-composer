<?php
/**
 * Plugin Name: WPGlobus for WPBakery Visual Composer
 * Plugin URI: https://github.com/WPGlobus/wpglobus-for-wpbakery-visual-composer
 * Description: WPGlobus add-on for WPBakery Visual Composer
 * Domain Path:
 * Version: 2.2.1
 * Author: WPGlobus
 * Author URI: https://wpglobus.com/
 * Network: false
 * License: GPL2
 * Credits: Alex Gor (alexgff) and Gregory Karpinsky (tivnet)
 * Copyright 2015-2022 WPGlobus
 * License: GPL-3.0-or-later
 * License URI: https://spdx.org/licenses/GPL-3.0-or-later.html
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 3, as
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

define( 'WPGLOBUS_JS_COMPOSER_VERSION', '2.2.1' );

add_action( 'plugins_loaded', 'wpglobus_js_composer_load', 11 );
function wpglobus_js_composer_load() {

	if ( ! defined( 'WPB_VC_VERSION' ) ) {
		return;
	}

	if ( defined( 'WPGLOBUS_VERSION' ) ) :
	
		/**
		 * @since 2.2.0
		 */
		if ( is_admin() ) {
			require 'includes/class-wpglobus-js-composer-admin.php';
			new WPGlobus_js_composer_Admin( __FILE__ );
		}

		if ( isset( WPGlobus::Config()->builder ) && WPGlobus::Config()->builder->is_builder_page() ) {

			/**
			 * Exit if builder is present and enabled.
			 * @since 1.4.2
			 */
			return;
		}
		
		if ( WPGlobus::Config()->toggle == 'off' ) {
			return;
		}

		add_filter( 'tiny_mce_before_init', 'wpglobus_js_composer_tiny_mce_before_init' );
		function wpglobus_js_composer_tiny_mce_before_init($mceInit) {

			if ( empty( $mceInit['selector'] ) ) {
				return $mceInit;
			}		
		
			global $post;

			if ( empty( $post ) ) {
				return $mceInit;
			}

			if ( false !== strpos( $mceInit['selector'], 'content' ) ) {

				$mceInit['setup'] = "function(editor) {
					editor.on( 'change', function(e) {
						if ( typeof WPGlobusJsComposer !== 'undefined' ) { 
							WPGlobusJsComposer.change(e, editor);
						}	
					});
				}";

			}

			return $mceInit;

		}

		add_action( 'admin_print_scripts', 'wpglobus_js_composer_admin_enqueue_scripts', 99 );
		function wpglobus_js_composer_admin_enqueue_scripts() {

			global $post;

			if ( ! is_admin() ) {
				return;
			}

			if ( empty( $post ) ) {
				return;
			}
			
			$version = '130';
			
			if ( version_compare( WPB_VC_VERSION, '5.3.9', '>' ) ) {
				$version = '140';
			}
			
			$wpglobus_composer_script_suffix = '.min';
			if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
				$wpglobus_composer_script_suffix = '';
			}

			wp_register_script(
				'wpglobus-js-composer',
				plugin_dir_url( __FILE__ ) . "/includes/js/wpglobus_js_composer$version" . $wpglobus_composer_script_suffix . ".js",
				array( 'jquery' ),
				WPGLOBUS_JS_COMPOSER_VERSION,
				true
			);
			wp_enqueue_script( 'wpglobus-js-composer' );

			wp_localize_script(
				'wpglobus-js-composer',
				'WPGlobusJsComposer',
				array(
					'wpglobus_composer_version' => WPGLOBUS_JS_COMPOSER_VERSION,
					'wpb_vc_version'  => WPB_VC_VERSION
				)
			);

		}

	endif;

}
