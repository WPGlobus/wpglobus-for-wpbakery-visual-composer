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
/*global jQuery, console, WPGlobusCore, WPGlobusJsComposer */
var WPGlobusJsComposer;

jQuery(document).ready(function ($) {
    "use strict";
	
	if ( typeof window.vc == 'undefined' )
		return
	
	if ( typeof vc.app == 'undefined' )
		return;		
	
	var content_default = WPGlobusAdmin.content,
		content_language = WPGlobusCoreData.default_language;
	
	WPGlobusJsComposer = {
		classic_mode: false,
		change: function(e){
			if ( content_language != WPGlobusCoreData.default_language ) {
				vc.storage.setContent( e.level.content );	
			}	
		}
	};
	
	$('.postdivrich-wpglobus').css('display','none');
	
	$('body').on('change', '.postdivrich-wpglobus', function(event){
		var ed = $(this).attr('id') + ' .wpglobus-editor';
		tinymce.get('content_'+content_language).setContent( $('#'+ed).val() );
		tinymce.triggerSave();
	});
	
	$('body').on('click', '.wpb_switch-to-composer', function(event){
		if ( $('.composer-switch').hasClass('vc_backend-status') ) {
			WPGlobusJsComposer.classic_mode = false;
			$('.postdivrich-wpglobus').css('display','none');
		} else {
			WPGlobusJsComposer.classic_mode = true;
			$('.postdivrich-wpglobus').css('display','block');
			$('#postdivrich').css('display','block');
			if ( content_language != WPGlobusCoreData.default_language ) {
				if ( tinymce.get('content_'+content_language).isHidden() ) {
					$('#content_'+content_language).val( vc.storage.getContent() );
				} else {
					tinymce.get('content_'+content_language).setContent( vc.storage.getContent() );
					tinymce.triggerSave();
				}	
			}	
		}
	});
	
	$(document).on( 'wpglobus_before_save_post', function(e) {
		if ( content_language != WPGlobusCoreData.default_language ) {
			tinymce.get('content_'+content_language).setContent( vc.storage.getContent() );
			tinymce.triggerSave();
			if ( tinymce.get('content').isHidden() ) {
				$('#content').val( content_default );
			} else {	
				tinymce.get('content').setContent( content_default );
				tinymce.triggerSave();
			}	
		}
		if ( 'tinymce' != getUserSetting('editor') ) {
			setUserSetting('editor','tinymce');
		}	
		tinymce.get('content').show();
	});
	
	$(document).on( 'wpglobus_post_body_tabs', function(e, otab, ntab) {
		if ( ntab == WPGlobusCoreData.default_language ) {
			$('#content_'+otab).val( vc.storage.getContent() );
			vc.storage.setContent( content_default );
		} else {
			if ( otab == WPGlobusCoreData.default_language ) {
				content_default = vc.storage.getContent();
			} else {
				if ( tinymce.get('content_'+otab).isHidden() ) {
					$('#content_'+otab).val( vc.storage.getContent() );
				} else {	
					tinymce.get('content_'+otab).setContent( vc.storage.getContent() );
					tinymce.triggerSave();
				}					
			}	
			vc.storage.setContent( $('#content_'+ntab).val() );
		}
		content_language = ntab;
		vc.app.show();
		if ( WPGlobusJsComposer.classic_mode ) {
			$('#wpb_visual_composer').css('display','none');
			if ( content_language == WPGlobusCoreData.default_language ) {
				$('#postdivrich').css('display','block');
			}	
		} else {
			$('.postdivrich-wpglobus').css('display','none');
			$('#wpb_visual_composer').css('display','block');
		}		
	});			
	
});
