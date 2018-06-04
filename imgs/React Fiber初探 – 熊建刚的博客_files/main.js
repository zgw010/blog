/**
 * Mobile navigation
 */
 
;(function( $, window, document, undefined ){
	"use strict";
	
	$( document ).ready( function ($) {
		
		var $body = $('body');

		$('#mobile-menu-toggle').click( function( e ) {
			$body.toggleClass('mobile-menu-open');
			$('html').toggleClass('mobile-menu-open');
			$( 'body,html' ).scrollTop( 0 );
			return false;
		} );

		var defaultWindowWidth = $(window).width();
		$(window).resize(function() {
			if ( defaultWindowWidth != $(window).width() ) {
				$body.removeClass('mobile-menu-open');
			}
		});

		var $mobile_nav = $('#mobile-navigation');

		var $clone_main_nav = $('#main-navigation').children().clone();
		$clone_main_nav.find( '.sub-posts' ).remove();
		$clone_main_nav = $clone_main_nav.removeAttr('id').removeClass('main-menu').addClass('mobile-menu');
		
		var $clone_top_nav = $('#top-navigation').children().clone();
		$clone_top_nav.find( '.sub-posts' ).remove();
		$clone_top_nav = $clone_top_nav.removeAttr('id').removeClass('top-menu').addClass('mobile-menu');
		
		$mobile_nav.append( $clone_main_nav, $clone_top_nav );	
		
		$body.on('touchstart', '.mobile-navigation', function(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			console.log(target);
			if (target.nodeName === 'A') {
		//		target.click && target.click();
			} else if ($(target).parent('a').length > 0) {
		//		$(target).parent('a')[0].click();
			} else {
				event.stopPropagation && event.stopPropagation();
				event.cancelBubble = true;	
			}
		});
			

	} );
})( jQuery, window , document );


/**
 * Scroll Up
 */
jQuery(document).ready(function(){
	jQuery("#scroll-up").hide();
	jQuery(function () {
		jQuery(window).scroll(function () {
			if (jQuery(this).scrollTop() > 800) {
				jQuery('#scroll-up').fadeIn();
			} else {
				jQuery('#scroll-up').fadeOut();
			}
		});
		jQuery('a#scroll-up').click(function () {
			jQuery('body,html').animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});
});


/**
 * No-touch detection
 */
if (!("ontouchstart" in document.documentElement)){ 
    document.documentElement.className += " no-touch"; 
}


/**
 * Skip link focus fix
 */
( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();
