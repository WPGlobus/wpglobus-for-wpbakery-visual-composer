=== WPGlobus for WPBakery Visual Composer ===
Contributors: alexgff, tivnetinc, tivnet
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SLF8M4YNZHNQN
Tags: WPGlobus, globalization, i18n, international, visual composer, localization, multilanguage, multilingual, translate, translation
Requires at least: 4.0
Tested up to: 4.8
Stable tag: trunk
License: GPL-3.0
License URI: http://www.gnu.org/licenses/gpl.txt

== Description ==

**WPGlobus for WPBakery Visual Composer** is an extension to the WPGlobus plugin.

> **NOTE:** You need to install and activate the [WPGlobus Multilingual Plugin](https://wordpress.org/plugins/wpglobus/) version 1.0.14 or later before installing the WPGlobus for WPBakery Visual Composer extension.

= More info =

* [WPGlobus for WPBakery Visual Composer home page](https://wpglobus.com/extensions-archive/wpglobus-for-wpbakery-visual-composer-archive/).
* [GitHub code repository](https://github.com/WPGlobus/wpglobus-for-wpbakery-visual-composer).

== Installation ==

You can install this plugin directly from your WordPress dashboard:

1. Go to the *Plugins* menu and click *Add New*.
1. Search for *WPGlobus for WPBakery Visual Composer*.
1. Click *Install Now* next to the *WPGlobus for WPBakery Visual Composer* plugin.
1. Activate the plugin.

Alternatively, see the guide to [Manually Installing Plugins](http://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).

== Frequently Asked Questions ==

= How do I contribute to WPGlobus for WPBakery Visual Composer? =

We appreciate all contributions, ideas, critique, and help.

* To speed up our development, please report bugs, with reproduction steps on [WPGlobus for WPBakery Visual Composer GitHub](https://github.com/WPGlobus/wpglobus-for-wpbakery-visual-composer).
* Plugin and theme authors: please try WPGlobus for WPBakery Visual Composer and let us know if you find any compatibility problems.
* Contact us directly on [WPGlobus.com](https://wpglobus.com/contact-us/).

= More info? =

Please check out the [WPGlobus Website](https://wpglobus.com/extensions-archive/wpglobus-for-wpbakery-visual-composer-archive/) for additional information.

== Screenshots ==

1. Plugin admin interface.

== Changelog ==

= 1.3.0 =
* COMPATIBILITY:
	* WordPress 4.8.
* ADDED:
	* revising code.
	
= 1.2.1 =
* FIXED:
	* Line breaks get lost for extra languages

= 1.2.0 =
* COMPATIBILITY:
	* WPBakery Visual Composer from v.4.11

= 1.1.1 =
* FIXED:
	* disable tinymce.triggerSave()
	* check '#content' for extra languages

= 1.1.0 =
* COMPATIBILITY:
	* WordPress 4.4-RC1
* ADDED:
	* heartbeat-send.autosave event handler
* FIXED:
	* event 'change' in editor text mode
	* undefined 'show' if tinymce.get('content') is null

= 1.0.6 =
* FIXED:
	* cannot read property 'setContent' of null in change event for some VC versions

= 1.0.5 =
* FIXED:
	* checking an option to start plugin load

= 1.0.4 =
* FIXED:
	* return array with TinyMCE config from filter

= 1.0.3 =
* FIXED:
	* don't make mce init for disabled post type
	* make mce init for id with 'content' only

= 1.0.2 =
* FIXED: tinymce.get(id) is null

= 1.0.1 =
* FIXED: WPGlobusAdmin is not defined for WPGlobus off mode

= 1.0.0 =
* Initial release
