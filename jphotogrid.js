/*
* Copyright (C) 2010 Joel Sutherland
* Licenced under the MIT license
* http://www.newmediacampaigns.com/page/zoomable-jquery-image-gallery-jphotogrid
*/
jQuery.noConflict(); 
(function(jQuery) {
	jQuery.fn.jphotogrid = function(settings, callback) {
		settings = jQuery.extend(true, {
			activeClass: 'active',
			selectedClass: 'selected',
			baseCSS: {},
			selectedCSS: {}
		}, settings);

		var url = settings.flickrbase + settings.feedapi + '?';
		var first = true;
		
		//Convert floats to absolute
		function toAbsolute(el){
			jQuery(el).children().each(function(){
				var pos = jQuery(this).position();
				jQuery(this).data('ptop',Math.floor(Number(pos.top)) + 'px');
				jQuery(this).data('pleft',Math.floor(Number(pos.left)) + 'px');
			}).each(function(){
				placeOriginal(this);
			});
		}
		
		function placeOriginal(el, animate, callback){
			var dtop = jQuery(el).data('ptop');
			var dleft = jQuery(el).data('pleft');
			var props = jQuery.extend({
				top: dtop,
				left: dleft
			}, settings.baseCSS);
			if(animate){
				jQuery(el).animate(props, 'slow', function(){
					if(jQuery.isFunction(callback)) callback();
				});
			}
			else{
				jQuery(el).css(jQuery.extend(props, {position: 'absolute'}));
			}
		}
		
		function hideSelected(callback){
			jQuerycontainer.find('.' + settings.selectedClass).each(function(){
				jQuery(this).removeClass(settings.selectedClass);
				placeOriginal(this, true);
			});
			if(jQuery.isFunction(callback)) callback();
		}
		
		function select(el){
			hideSelected(function(){
				jQuery(el).addClass('selected').removeClass('active');
				jQuery(el).animate(settings.selectedCSS, 'slow');
			});
		}

		for(var key in settings.qstrings){
			if(!first)
				url += '&';
			url += key + '=' + settings.qstrings[key];
			first = false;
		}

		return jQuery(this).each(function(){
			jQuerycontainer = jQuery(this);
			jQuery(this).css('position','relative');
			toAbsolute(this);
			
			jQuery(this).children()
				.css('cursor', 'pointer')
				.hover(function(){
					if(!jQuery(this).hasClass(settings.selectedClass))
						jQuery(this).addClass(settings.activeClass);
				},function(){
					jQuery(this).removeClass(settings.activeClass);
				});
			jQuery('.' + settings.activeClass).live('click', function(){				
				select(this);
			});
			jQuery('.' + settings.selectedClass).live('click', function(){
				hideSelected();
			});
			
			jQuery(this).find('div')
				.hover(function(){
					jQuery(this).css('opacity', 0);
				},function(){
					jQuery(this).css('opacity', .5);
				})
				.click(function(){
					jQuery(this).css('opacity', 0);
					jQueryli = jQuery(this).parent();
					jQueryli.css("z-index", 99);
					jQueryli.animate({
						top: 0,
						left: 0,
						width: '100%',
						height: '400px'
					}, 'slow');
				});
			});
	}
})(jQuery);