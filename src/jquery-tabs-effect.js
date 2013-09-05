// elementTransitions
;
(function(window, document, $, undefined) {
	var $doc = $(document);
	var effects = {
		options: {
			inClass: '',
			outClass: '',
			$block: null,
			$pages: null
		},

		animEndEventName: '',
		isAnimating: false,
		current: 0,
		total: 0,
		inClass: '',
		outClass: '',

		$block: '',
		$pages: '',

		animEndEventNames: {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},

		init: function(options) {
			this.options = $.extend({}, this.options, options);

			this.$pages = this.options.$pages;
			this.$block = this.options.$block;

			this.inClass = this.formatClass(this.options.inClass);
			this.outClass = this.formatClass(this.options.outClass);
			this.total = this.options.$pages.length;
			this.animEndEventName = this.animEndEventNames[this.getTransitionPrefix()];

			this.$block.addClass('effect_' + this.options.effect);

		},
		nextPage: function() {
			var last = this.current;

			if (this.isAnimating) {
				return false;
			}

			this.isAnimating = true;

			if (this.current < this.total - 1) {
				this.current++;
			} else {
				this.current = 0;
			}

			this.animate(last, this.current);
		},
		prevPage: function() {
			var last = this.current;

			if (this.isAnimating) {
				return false;
			}

			this.isAnimating = true;

			if (this.current > 0) {
				this.current--;
			} else {
				this.current = this.total - 1;
			}

			this.animate(last, this.current);
		},
		animate: function(currentIndex, nextIndex, callback) {
			var self = this,
				endCurrPage = false,
				endNextPage = false,
				$currPage = this.$pages.eq(currentIndex),
				$nextPage = this.$pages.eq(nextIndex);

			$currPage.addClass(this.outClass + ' effect_last').on(this.animEndEventName, function() {
				$currPage.off(self.animEndEventName);
				endCurrPage = true;
				if (endNextPage) {
					if (jQuery.isFunction(callback)) {
						callback(self.$block, $nextPage, $currPage);
					}
					self.onEndAnimation($currPage, $nextPage);
				}
			});

			$nextPage.addClass(this.inClass).on(this.animEndEventName, function() {
				$nextPage.off(self.animEndEventName);
				endNextPage = true;
				if (endCurrPage) {
					self.onEndAnimation($currPage, $nextPage);
				}
			});
		},
		onEndAnimation: function($outpage, $inpage) {
			this.resetPage($outpage, $inpage);
			this.isAnimating = false;
		},
		resetPage: function($outpage, $inpage) {
			this.$pages.removeClass('effect_last');
			$outpage.removeClass(this.outClass);
			$inpage.removeClass(this.inClass);
		},
		formatClass: function(str) {
			var classes = str.split(" "),
				len = classes.length,
				output = "";

			for (var n = 0; n < len; n++) {
				output += " effect_" + this.options.effect + classes[n];
			}
			return $.trim(output);
		},
		getTransitionPrefix: function() {
			var b = document.body || document.documentElement,
				v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
				s = b.style,
				p = 'animation';

			if (typeof s[p] === 'string') {
				return 'animation';
			}

			p = p.charAt(0).toUpperCase() + p.substr(1);

			for (var i = 0; i < v.length; i++) {
				if (typeof s[v[i] + p] === 'string') {
					return v[i] + p;
				}

			}
			return false;
		}
	};

	$doc.on('tabs::init', function(event, instance) {
		if (instance.options.ifAnimate === false) {
			return false;
		}
		instance.effects = $.extend(true, {}, effects);
		instance.effects.init({
			effect: instance.options.animate.effect,
			inClass: instance.options.animate.inClass,
			outClass: instance.options.animate.outClass,
			$block: instance.$panes,
			$pages: instance.$paneItems
		});
	});

	$doc.on('tabs::active', function(event, instance) {
		if (instance.options.ifAnimate === false || instance.initialized === false) {
			return false;
		}
		instance.effects.animate(instance.last, instance.current);
	});

})(window, document, jQuery);
