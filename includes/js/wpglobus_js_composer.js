/**
 * WPGlobus Composer
 * Interface JS functions
 *
 * @since 1.0.0
 *
 * @package WPGlobus
 * @subpackage Administration
 */
/*jslint browser: true*/
/*global jQuery, console, vc, WPGlobusAdmin, WPGlobusCoreData, WPGlobusJsComposer*/

jQuery(document).ready(function ($) {
    "use strict";
	
	if ( typeof window.vc == 'undefined' )
		return
	
	if ( typeof vc.app == 'undefined' )
		return;		

	if ( typeof WPGlobusAdmin == 'undefined' )
		return;

	var api = {
		classic_mode: false,
		content_default: WPGlobusAdmin.content,
		content_language: WPGlobusCoreData.default_language,
		init: function(args) {
			$('.postdivrich-wpglobus').css('display','none');
			api.addListeners();
		},	
		change: function(e){
			if ( api.content_language != WPGlobusCoreData.default_language ) {
				vc.storage.setContent( e.level.content );	
			}	
		},
		addListeners: function(){
			
			$( document ).on( 'heartbeat-send.autosave', function(e, data) {
				if ( typeof data['wpglobus_heartbeat'] !== 'undefined' ) {
					if ( api.content_language != WPGlobusCoreData.default_language ) {
						data['wp_autosave']['content'] = api.content_default;
					}	
				}
			});				

			$( 'body' ).on( 'change', '.postdivrich-wpglobus', function(event){
				// event was fired in editor text mode 
				var ed = $(this).attr('id') + ' .wpglobus-editor';
				vc.storage.setContent( $('#'+ed).val() );
			});
			
			$( 'body' ).on( 'click', '.wpb_switch-to-composer', function(event){
				if ( $('.composer-switch').hasClass( 'vc_backend-status' ) ) {
					api.classic_mode = false;
					$( '.postdivrich-wpglobus' ).css( 'display', 'none' );
				} else {
					api.classic_mode = true;
					$( '.postdivrich-wpglobus' ).css( 'display','block' );
					$(  '#postdivrich').css( 'display','block' );
					if ( api.content_language != WPGlobusCoreData.default_language ) {
						if ( tinymce.get( 'content_' + api.content_language ) == null || tinymce.get( 'content_' + api.content_language ).isHidden() ) {
							$( '#content_' + api.content_language ).val( vc.storage.getContent() );
						} else {
							tinymce.get( 'content_' + api.content_language ).setContent( vc.storage.getContent() );
							//tinymce.triggerSave();
						}	
					}	
				}
			});	

			$( document ).on( 'wpglobus_before_save_post', function(e, args) {

				if ( api.content_language != WPGlobusCoreData.default_language ) {

					if ( tinymce.get( 'content_' + api.content_language ) == null || tinymce.get( 'content_' + api.content_language ).isHidden() ) {
						$( '#content_' + api.content_language ).val( vc.storage.getContent() );
					} else {
						tinymce.get( 'content_' + api.content_language ).setContent( vc.storage.getContent() );
						//tinymce.triggerSave();
					}	
					
					if ( tinymce.get( 'content' ) == null || tinymce.get( 'content' ).isHidden() ) {
						$( '#content' ).val( api.content_default );
					} else {	
						tinymce.get( 'content' ).setContent( api.content_default );
						//tinymce.triggerSave();
					}	
					if ( typeof args !== 'undefined' && typeof args.content_tabs_id !== 'undefined' ) {
						if (  $( args.content_tabs_id ).size() == 1 ) {
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
			
			$( document ).on( 'wpglobus_post_body_tabs', function(e, otab, ntab) {

				if ( ntab == WPGlobusCoreData.default_language ) {
				
					$( '#content_' + otab ).val( vc.storage.getContent() );
					vc.storage.setContent( api.content_default );
				
				} else {
					
					if ( otab == WPGlobusCoreData.default_language ) {

						api.content_default = vc.storage.getContent();

					} else {
						if ( tinymce.get( 'content_' + otab ) == null || tinymce.get( 'content_'+otab ).isHidden() ) {
							$( '#content_' + otab ).val( vc.storage.getContent() );
						} else {	
							tinymce.get( 'content_' + otab ).setContent( vc.storage.getContent() );
							//tinymce.triggerSave();
						}					
					}	
					vc.storage.setContent( $( '#content_' + ntab ).val() );
				
				}
				api.content_language = ntab;
				vc.app.show();
				if ( api.classic_mode ) {
					$( '#wpb_visual_composer' ).css( 'display', 'none' );
					if ( api.content_language == WPGlobusCoreData.default_language ) {
						$( '#postdivrich' ).css( 'display', 'block' );
					}	
				} else {
					$( '.postdivrich-wpglobus' ).css( 'display', 'none' );
					$( '#wpb_visual_composer' ).css( 'display', 'block' );
				}		
			});					
			
		}	
	};
	
	WPGlobusJsComposer = $.extend({}, WPGlobusJsComposer, api);
	
	WPGlobusJsComposer.init();	

});
