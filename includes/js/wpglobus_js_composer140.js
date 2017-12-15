/**
 * WPGlobus Composer
 * Interface JS functions
 *
 * @since 1.4.0
 *
 * @package WPGlobus
 * @subpackage Administration
 */
/*jslint browser: true*/
/*global jQuery, console, vc, WPGlobusAdmin, WPGlobusCoreData, WPGlobusJsComposer*/

jQuery(document).ready(function ($) {
    "use strict";
	
	if ( 'undefined' === typeof window.vc ) {
		return
	}
	
	if ( 'undefined' === typeof vc.app ) {
		return;
	}

	if ( 'undefined' === typeof WPGlobusAdmin ) {
		return;
	}

	var api = {
		classicMode: false,
		contentDefault: WPGlobusAdmin.content,
		contentLanguage: WPGlobusCoreData.default_language,
		dLang: '',
		changePrevented: false,
		init: function( args ) {
			$( '.postdivrich-wpglobus' ).css( 'display', 'none' );
			api.addListeners();
		},	
		change: function(e){
			/**
			 * We need to replicate content.
			 * @see
			 * vc.storage.getContent()/setContent()
			 * tinymce.get('content').getContent()/setContent()
			 * jQuery('#content').val()
			 *
			 */
			if ( api.changePrevented ) {
				/**
				 * Don't run again to prevent infinite loop.
				 */
				return;
			}

			/**
			 * Event is fired when content editor was changed.
			 * @see editor.on('change') in wpglobus-for-wpbakery-visual-composer\wpglobus_js_composer.php
			 */ 
			api.dLang = WPGlobusCoreData.default_language;
			var content;
			if ( api.contentLanguage != WPGlobusCoreData.default_language ) {
				
				if ( api.classicMode ) {
					if ( tinymce.get('content_'+api.contentLanguage) == null || tinymce.get('content_'+api.contentLanguage).isHidden() ) {
						content = $('#content_'+api.contentLanguage).val();
					} else {
						content = tinymce.get('content_'+api.contentLanguage).getContent();
					}
				} else {
					if ( 'undefined' === typeof e.level ) {
						content = vc.storage.getContent();
					} else {
						content = e.level.content;
					}
				}				
				_.debounce( 
					api.replicateContent(content),
					500 
				);
				
			}	
		},
		replicateContent: function(content) {
			$('#content_' + api.contentLanguage).val(content);
			if ( api.classicMode ) {
				api.changePrevented = true;
				vc.storage.setContent(content);
				api.changePrevented = false;
			} else {
				/**
				 * To prevent get lost line breaks for extra languages.
				 * @since 1.4.1
				 */
				if ( 1 ) {
					/**
					 * #content contains text in current language.
					 */
					tinymce.get('content_' + api.contentLanguage).setContent(tinymce.get('content').getContent());
				} else {
					tinymce.get('content_' + api.contentLanguage).setContent(content);	
				}	
			}
		},
		addListeners: function(){
			
			$(document).on( 'heartbeat-send.autosave', function(e, data) {
				if ( typeof data['wpglobus_heartbeat'] !== 'undefined' ) {
					if ( api.contentLanguage != WPGlobusCoreData.default_language ) {
						data['wp_autosave']['content'] = api.contentDefault;
					}	
				}
			});				

			$(document).on( 'change', '.postdivrich-wpglobus', function(event){
				/**
				 * Event was fired in editor text mode.
				 */	
				var ed = $(this).attr('id') + ' .wpglobus-editor';
				vc.storage.setContent( $( '#' + ed ).val() );
			});
			
			$(document).on( 'click', '.wpb_switch-to-composer', function(event){
				
				if ( $('.composer-switch').hasClass( 'vc_backend-status' ) ) {
					api.classicMode = false;
					$( '.postdivrich-wpglobus' ).css( 'display', 'none' );
				} else {
					api.classicMode = true;
					$( '.postdivrich-wpglobus' ).css( 'display', 'block' );
					$('#postdivrich').css( 'display', 'block' );
				}
				
			});	

			/**
			 * @see trigger 'wpglobus_before_save_post' in wpglobus-admin.js
			 */			
			$(document).on( 'wpglobus_before_save_post', function(e, args) {

				if ( api.contentLanguage != WPGlobusCoreData.default_language ) {
					
					if ( tinymce.get( 'content_' + api.contentLanguage ) == null || tinymce.get( 'content_' + api.contentLanguage ).isHidden() ) {
						$( '#content_' + api.contentLanguage + '-tmce' ).click();
					}
					
					if ( tinymce.get( 'content' ) == null || tinymce.get( 'content' ).isHidden() ) {
						$( '#content' ).val( api.contentDefault );
						$( '#content-tmce' ).click();
					} else {	
						tinymce.get( 'content' ).setContent( api.contentDefault );
					}	
					
					if ( typeof args !== 'undefined' && typeof args.content_tabs_id !== 'undefined' ) {
						if (  $( args.content_tabs_id ).size() == 1 ) {
							api.contentLanguage = WPGlobusCoreData.default_language;
							$( args.content_tabs_id ).tabs( 'option', 'active', 0 );
						}
					}
					
				}
				if ( 'tinymce' != getUserSetting( 'editor' ) ) {
					setUserSetting( 'editor', 'tinymce' );
				}	
				if ( tinymce.get( 'content' ) !== null ) {
					tinymce.get( 'content' ).show();
				}
	
			});
			
			/**
			 * @see trigger 'wpglobus_post_body_tabs' in wpglobus-admin.js
			 */
			$(document).on( 'wpglobus_post_body_tabs', function(e, oTab, nTab) {
				api.changePrevented = true;
				if ( oTab == WPGlobusCoreData.default_language ) {
				
					api.contentDefault = vc.storage.getContent();
					vc.storage.setContent( $( '#content_' + nTab ).val() );
					
				} else {
					
					if ( nTab == WPGlobusCoreData.default_language ) {
						$( '#content_' + oTab ).val( vc.storage.getContent() );
						vc.storage.setContent( api.contentDefault );						
					} else {
						$( '#content_' + oTab ).val( vc.storage.getContent() );
						vc.storage.setContent( $( '#content_' + nTab ).val() );
					}
					
				}	
				
				api.contentLanguage = nTab;
				vc.app.show();
				if ( api.classicMode ) {
					$( '#wpb_visual_composer' ).css( 'display', 'none' );
					if ( api.contentLanguage == WPGlobusCoreData.default_language ) {
						$( '#postdivrich' ).css( 'display', 'block' );
					}	
				} else {
					$( '.postdivrich-wpglobus' ).css( 'display', 'none' );
					$( '#wpb_visual_composer' ).css( 'display', 'block' );
				}					
				api.changePrevented = false;
			});					
			
		}	
	};
	
	WPGlobusJsComposer = $.extend({}, WPGlobusJsComposer, api);
	
	WPGlobusJsComposer.init();	

});
