/*! jQuery tabs - v0.3.0 - 2013-09-09
* https://github.com/amazingSurge/jquery-tabs
* Copyright (c) 2013 amazingSurge; Licensed GPL */
// elementTransitions

(function(window, document, $, undefined) {
	var $doc = $(document);
	var effects = {
		options: {
			$parent: null,
			$panes: null
		},

		animEndEventName: '',
		isAnimating: false,
		current: 0,
		total: 0,
		$parent: '',
		$panes: '',

		animEndEventNames: {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},
		init: function(options) {
			this.options = $.extend({}, this.options, options);

			this.$panes = this.options.$panes;
			this.$parent = this.options.$parent;

			this.inClass = 'effect_' + this.options.effect;
			this.outClass = this.revertClass(this.options.effect);
			this.total = this.options.$panes.length;
			this.animEndEventName = this.animEndEventNames[this.getTransitionPrefix()];

			this.$parent.addClass('effect_' + this.options.effect);

		},
		next: function() {
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
		prev: function() {
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
				$currPage = this.$panes.eq(currentIndex),
				$nextPage = this.$panes.eq(nextIndex);

			$currPage.addClass(this.outClass + ' effect_last').on(this.animEndEventName, function() {
				$currPage.off(self.animEndEventName);
				endCurrPage = true;
				if (endNextPage) {
					if (jQuery.isFunction(callback)) {
						callback(self.$parent, $nextPage, $currPage);
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
			this.reset($outpage, $inpage);
			this.isAnimating = false;
		},
		reset: function($outpage, $inpage) {
			this.$panes.removeClass('effect_last');
			$outpage.removeClass(this.outClass);
			$inpage.removeClass(this.inClass);
		},
		revertClass: function(str) {
			var classes = str.split(" "),
				len = classes.length,
				inre = ['Up', 'Down', 'In', 'Out', 'Left', 'Right', 'Top', 'Bottom'],
				outre = ['Down', 'Up', 'Out', 'In', 'Right', 'Left', 'Bottom', 'Top'],
				output = "",
				re = "",
				re_array = [],
				re_num = "";

			for (var n = 0; n < len; n++) {
				for (var m = 0; m < inre.length; m++) {
					re = new RegExp(inre[m]);
					if (re.test(classes[n])) {
						re_array.push(m);
					}
				}
				for (var l = 0; l < re_array.length; l++) {
					re_num = re_array[l];
					classes[n] = classes[n].replace(inre[re_num], re_num);
				}
				for (var k = 0; k < re_array.length; k++) {
					re_num = re_array[k];
					classes[n] = classes[n].replace(re_num, outre[re_num]);
				}
				output += " effect_" + classes[n];
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
		if (instance.options.effect === false) {
			return false;
		}
		instance.effects = $.extend(true, {}, effects);
		instance.effects.init({
			effect: instance.options.effect,
			$parent: instance.$panes_wrap,
			$panes: instance.$panes
		});
	});
	
	$doc.on('tabs::active', function(event, instance) {
		if (instance.options.effect === false || instance.initialized === false) {
			return false;
		}
		instance.effects.animate(instance.last, instance.current);
	});

})(window, document, jQuery);

// jquery tabs history

(function(window, document, $, undefined) {
	var $doc = $(document);
	var history = {
		states: {},
		refresh: false, // avoid repeating update
		stopHashchangeEvent: false, // stop trigger hashChange when push state
		on: function(eventType, callback) {
			var self = this;
			$(window).on(eventType, function(e) {
				if (self.stopHashchangeEvent) {
					return false;
				} else {
					callback(e);
					return false;
				}

			});
		},
		off: function(eventType) {
			$(window).off(eventType);
		},
		pushState: function(state) {
			var id;
			for (id in state) {
				this.states[id] = state[id];
			}
			this.refresh = false;
			this.stopHashchangeEvent = true;
			setTimeout($.proxy(this.changeStates, this), 0);
		},
		changeStates: function() {
			var self = this,
				hash = '';
			if (this.refresh === true) {
				return;
			}

			$.each(this.states, function(id, index) {
				hash += id + '=' + index + '&';
			});

			window.location.hash = hash.substr(0, hash.length - 1);
			this.refresh = true;
			setTimeout(function() {
				self.stopHashchangeEvent = false;
			}, 0);
		},
		getState: function() {
			var hash = window.location.hash.replace('#', '').replace('!', ''),
				queryString, param = {};

			if (hash === '') {
				return {};
			}

			queryString = hash.split("&");

			$.each(queryString, function(i, v) {
				if (v === false) {
					return;
				}
				var args = v.match("#?(.*)=(.*)");

				if (args) {
					param[args[1]] = args[2];
				}

			});

			return param;
		},
		reset: function() {
			if (this.refresh === true) {
				return;
			}
			this.states = {};
			window.location.hash = "#/";

			this.refresh = true;
		}
	};

	$doc.on('tabs::init', function(event, instance) {
		if (instance.options.history === false) {
			return;
		}
		var hashchange = function() {
			var states = history.getState(),
				tabs,
				id = instance.$element.attr('id');

			if (states[id]) {
				tabs = $('#' + id).data('tabs');
				if (tabs) {
					var $tab = instance.$element.find('#' + states[id]);
					if ($tab.length >= 1) {
						tabs.active(instance.$tabs.index($tab));
					} else {
						tabs.active(states[id]);
					}

				}
			}
		};

		history.on('hashchange.tabs', hashchange);
	});

	$doc.on('tabs::afterActive', function(event, instance) {
		var index = instance.current,
			state = {},
			id = instance.$element.attr('id'),
			content = instance.$tabs.eq(index).attr('id');

		if (instance.options.history === false) {
			return;
		}

		if (content) {
			state[id] = content;
		} else {
			state[id] = index;
		}
		history.pushState(state);
	});

	setTimeout(function() {
		$(window).trigger('hashchange.tabs');
	}, 0);
})(window, document, jQuery);

// jquery tabs keyboard

(function(window, document, $, undefined) {
	var $doc = $(document);
	var keyboard = {
		keys: {
			'UP': 38,
			'DOWN': 40,
			'LEFT': 37,
			'RIGHT': 39,
			'RETURN': 13,
			'ESCAPE': 27,
			'BACKSPACE': 8,
			'SPACE': 32
		},
		map: {},
		bound: false,
		press: function(e) {
			var key = e.keyCode || e.which;
			if (key in keyboard.map && typeof keyboard.map[key] === 'function') {
				e.preventDefault();
				return keyboard.map[key].call(this, e);
			}
		},
		attach: function(map) {
			var key, up;
			for (key in map) {
				if (map.hasOwnProperty(key)) {
					up = key.toUpperCase();
					if (up in keyboard.keys) {
						keyboard.map[keyboard.keys[up]] = map[key];
					} else {
						keyboard.map[up] = map[key];
					}
				}
			}
			if (!keyboard.bound) {
				keyboard.bound = true;
				$doc.bind('keydown', keyboard.press);
			}
		},
		detach: function() {
			keyboard.bound = false;
			keyboard.map = {};
			$doc.unbind('keydown', keyboard.press);
		}
	};

	$doc.on('tabs::init', function(event, instance) {
		if (instance.options.keyboard === false) {
			return;
		}

		// make ul div etc. get focus
		instance.$element.add(instance.$panes_wrap).attr('tabindex', '0').on('focus', function() {
			keyboard.attach({
				left: $.proxy(instance.prev, instance),
				right: $.proxy(instance.next, instance)
			});
			return false;
		}).on('blur', function() {
			keyboard.detach();
			return false;
		});

	});
})(window, document, jQuery);

/*! jQuery tabs - v0.3.0 - 2013-09-09
 * https://github.com/amazingSurge/jquery-tabs
 * Copyright (c) 2013 amazingSurge; Licensed GPL */

(function(window, document, $, undefined) {
	"use strict";

	// Constructor
	var Tabs = $.Tabs = function(element, options) {
		var self = this;

		this.element = element;
		this.$element = $(element);

		// options
		var meta_data = [];
		$.each(this.$element.data(), function(k, v) {
			var re = new RegExp("^tabs", "i");
			if (re.test(k)) {
				meta_data[k.toLowerCase().replace(re, '')] = v;
			}
		});

		this.options = $.extend(true, {}, Tabs.defaults, options, meta_data);
		this.namespace = this.options.namespace;
		this.initialized = false;

		// Class
		this.classes = {
			activeTab: this.namespace + '_active',
			activePane: this.namespace + '_active',
			panes_wrap: this.namespace + '-panes',
			skin: this.namespace + '_' + this.options.skin
		};

		this.$tabs = this.$element.children();
		this.$panes_wrap = $(this.options.panes_wrap).addClass(this.classes.panes_wrap);
		this.$panes = this.$panes_wrap.children();
		this.size = this.$tabs.length;

		if (this.options.skin) {
			this.$element.addClass(this.classes.skin);
			this.$panes_wrap.addClass(this.classes.skin);
		}

		this.$loading = $('<span class="' + this.namespace + '-loading"></span>');

		if (this.options.ajax === true) {
			this.ajax = [];
			$.each(this.$tabs, function(i, v) {
				var obj = {};
				obj.href = $(v).data('href');
				self.ajax.push(obj);
			});
		}

		this.init();
	};


	// Default options for the plugin as a simple object
	Tabs.defaults = {
		namespace: 'tabs',
		panes_wrap: '.panes_wrap',
		skin: null,
		initialIndex: 0,
		ajax: false,
		cached: false,
		history: false,
		keyboard: false,
		effect: false, // slideIn, scaleUp, scaleUpDown, scaleUpCenter, flipInLeft, flipInRight, flipInRight, flipInBottom, flipInTop
		event: 'click'
	};

	Tabs.prototype = {
		constructor: Tabs,
		init: function() {
			var self = this;

			// Bind logic
			this.$element.on(this.options.event, '> *', function(e) {
				var index = $(e.target).index();
				self.active(index);
				self.afterActive();
				return false;
			});

			this.$element.trigger('tabs::init', this);

			this.active(this.options.initialIndex);
			this.initialized = true;

			this.$element.trigger('tabs::ready', this);
		},
		// This is a public function that users can call
		// Prototype methods are shared across all instances
		active: function(index) {

			if (this.current === index) {
				return;
			}

			this.last = this.current;
			this.current = index;
			this.$tabs.eq(index).addClass(this.classes.activeTab).siblings().removeClass(this.classes.activeTab);
			this.$panes.eq(index).addClass(this.classes.activePane).siblings().removeClass(this.classes.activePane);

			this.$element.trigger('tabs::active', this);

			if ($.type(this.options.onActive) === 'function') {
				this.options.onActive(this);
			}

			if (this.options.ajax === true) {
				this.ajaxLoad(index);
			}
		},
		afterActive: function() {
			this.$element.trigger('tabs::afterActive', this);
			if ($.type(this.options.onAfterActive) === 'function') {
				this.options.onAfterActive(this);
			}
		},
		ajaxLoad: function(index) {
			var self = this,
				dtd;
			if (this.options.cached === true && this.ajax[index].cached === true) {
				return;
			} else {
				this.showLoading();
				dtd = $.ajax({
					url: this.ajax[index].href
				});
				dtd.done(function(data) {
					self.ajax[index].cached = true;
					self.hideLoading();
					self.$panes.eq(index).html(data);
				});
				dtd.fail(function() {
					self.hideLoading();
					self.$panes.eq(index).html('failed');
				});
			}
		},
		showLoading: function() {
			this.$loading.appendTo(this.$panes_wrap);
		},
		hideLoading: function() {
			this.$loading.remove();
		},
		getTabs: function() {
			return this.$tabs;
		},
		getPanes_wrap: function() {
			return this.$panes;
		},
		getCurrentPane: function() {
			return this.$panes.eq(this.current);
		},
		getCurrentTab: function() {
			return this.$tabs.eq(this.current);
		},
		getIndex: function() {
			return this.current;
		},
		getSize: function() {
			return this.size;
		},
		append: function(title, content) {
			this.add(title, content, this.size);
		},
		add: function(title, content, index) {
			this.$tabs.eq(index - 1).after(this.$tabs.eq(0).clone().removeClass(this.classes.activeTab).html(title));
			this.$panes.eq(index - 1).after(this.$panes.eq(0).clone().removeClass(this.classes.activePane).html(content));

			this.$tabs = this.$element.children();
			this.$panes = this.$panes_wrap.children();
			this.size++;
		},
		enable: function() {

		},
		disable: function() {

		},
		next: function() {
			var len = this.$tabs.length,
				current = this.current;
			if (current < len - 1) {
				current++;
			} else {
				current = 0;
			}

			this.active(current);
		},
		prev: function() {
			var len = this.$tabs.length,
				current = this.current;
			if (current === 0) {
				current = Math.abs(1 - len);
			} else {
				current = current - 1;
			}

			this.active(current);
		},
		destroy: function() {

		}
	};

	// Collection method.
	$.fn.tabs = function(options) {
		if (typeof options === 'string') {
			var method = options;
			var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

			if (/^(getTabs|getPanes_wrap|getCurrentPane|getCurrentTab|getIndex)$/.test(method)) {
				var api = this.first().data('tabs');
				if (api && typeof api[method] === 'function') {
					return api[method].apply(api, method_arguments);
				}
			} else {
				return this.each(function() {
					var api = $.data(this, 'tabs');
					if (api && typeof api[method] === 'function') {
						api[method].apply(api, method_arguments);
					}
				});
			}
		} else {
			return this.each(function() {
				if (!$.data(this, 'tabs')) {
					$.data(this, 'tabs', new Tabs(this, options));
				}
			});
		}
	};
}(window, document, jQuery));
