<?php
/**
 * File: class-wpglobus-js-composer-admin.php
 *
 * WPGlobus_js_composer_Admin class.
 *
 * @since 2.2.1
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WPGlobus_js_composer_Admin' ) ) :

	class WPGlobus_js_composer_Admin {
		
		/**
		 * Instance.
		 */
		protected static $instance = null;
		
		/**
		 * Get instance.
		 *
		 * @param string $path_to_loader
		 *
		 * @return WPGlobus_js_composer_Admin
		 */
		public static function get_instance( $path_to_loader = '' ) {
			
			if ( null === self::$instance ) {
				self::$instance = new self( $path_to_loader );
			}

			return self::$instance;
		}
		
		/**
		 * Constructor.
		 */
		public function __construct( $path_to_loader ) {
			
			/**
			 * @see wp-includes/link-template.php
			 */
			add_filter( 'get_edit_post_link', array( __CLASS__, 'filter__get_edit_post_link' ), 5, 3 );
		}
		
		/**
		 * @see get_edit_post_link() function in wp-admin\includes\class-wp-posts-list-table.php
		 */
		public static function filter__get_edit_post_link( $link, $post_id, $context ) {
			
			global $pagenow;
			
			if ( 'edit.php' === $pagenow ) {
					
				static $cache = null;
				
				if ( ! is_null( $cache ) && isset( $cache[$post_id] ) ) {

					if ( false === $cache[$post_id] ) {
						return $link;
					}
					return $cache[$post_id];
				}
				
				global $wpdb;
				
				$res = $wpdb->get_results( 
					 $wpdb->prepare(
						"SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id = %d AND ( meta_key=%s OR meta_key = %s )",
						$post_id,
						'_wpb_vc_js_status',
						'classic-editor-remember'
					),
					OBJECT_K
				);
				
				$cache[$post_id] = false;
				
				$_wpb_vc_js_status = null;
				if ( ! empty( $res['_wpb_vc_js_status'] ) ) {
					$_wpb_vc_js_status = $res['_wpb_vc_js_status'];
				}
		
				$classic_editor_remember = null;
				if ( ! empty( $res['classic-editor-remember'] ) ) {
					$classic_editor_remember = $res['classic-editor-remember'];
				}
				
				if ( ! is_null( $_wpb_vc_js_status ) && $_wpb_vc_js_status->meta_value === 'true' ) {
					if ( ! is_null( $classic_editor_remember ) &&  'classic-editor' === $classic_editor_remember->meta_value ) {
						$cache[$post_id] = $link . '&amp;classic-editor';
					}
				}
				
				if ( $cache[$post_id] ) {
					return $cache[$post_id];
				}
						
			}
		
			return $link;
		}
	}

endif;

# --- EOF
