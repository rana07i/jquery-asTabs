/*! jQuery tabs - v0.1.1 - 2013-08-08
* https://github.com/amazingSurge/jquery-tabs
* Copyright (c) 2013 amazingSurge; Licensed GPL */
;
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
			activePanes: this.namespace + '_active',
			panes: this.namespace + '-panes',
			skin: this.namespace + '_' + this.options.skin
		};

		this.$tabItems = this.$element.children();
		this.$panes = $(this.options.panes).addClass(this.classes.panes);
		this.$paneItems = this.$panes.children();
		this.size = this.$tabItems.length;

		if (this.options.skin) {
			this.$element.addClass(this.classes.skin);
			this.$panes.addClass(this.classes.skin);
		}

		this.$loading = $('<span class="' + this.namespace + '-loading"></span>');

		if (this.options.ajax === true) {
			this.ajax = [];
			$.each(this.$tabItems, function(i, v) {
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

		panes: '.panes',

		skin: null,
		initialIndex: 0,

		ajax: false,
		cached: false,

		history: false,
		keyboard: false,

		ifAnimate: false,
		animate: {
			inClass: '',
			outClass: ''
		},

		event: 'click'
	};

	Tabs.prototype = {
		constructor: Tabs,
		init: function() {
			var self = this;

			// Bind logic
			this.$tabItems.on(this.options.event, function(e) {
				var index = $(e.target).index();
				self.active(index);
				self.afterActive();
				return false;
			});

			this.$element.trigger('tabs::init', this);
			if ($.type(this.options.onInit) === 'function') {
				this.options.onInit(this);
			}

			this.active(this.options.initialIndex);
			this.initialized = true;

			this.$element.trigger('tabs::ready', this);
		},
		// This is a public function that users can call
		// Prototype methods are shared across all instances
		active: function(index) {
			var self = this;

			if (this.current === index) {
				return;
			}

			this.last = this.current;
			this.current = index;
			this.$tabItems.eq(index).addClass(this.classes.activeTab).siblings().removeClass(this.classes.activeTab);
			this.$paneItems.eq(index).addClass(this.classes.activePanes).siblings().removeClass(this.classes.activePanes);

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
					self.$paneItems.eq(index).html(data);
				});
				dtd.fail(function() {
					self.hideLoading();
					self.$paneItems.eq(index).html('failed');
				});
			}
		},

		showLoading: function() {
			this.$loading.appendTo(this.$panes);
		},
		hideLoading: function() {
			this.$loading.remove();
		},

		getTabs: function() {
			return this.$tabItems;
		},

		getPanes: function() {
			return this.$paneItems;
		},

		getCurrentPane: function() {
			return this.$paneItems.eq(this.current);
		},

		getCurrentTab: function() {
			return this.$tabItems.eq(this.current);
		},

		getIndex: function() {
			return this.current;
		},

		getSize: function() {
			return this.size;
		},

		append: function(title, content) {

		},

		insertBefore: function(title, content, index) {

		},

		insertAfter: function(title, content, index) {

		},

		enable: function(index){

		},

		disable: function(index){

		},

		next: function() {
			var len = this.$tabItems.length,
				current = this.current;
			if (current < len - 1) {
				current++;
			} else {
				current = 0;
			}

			this.active(current);
		},

		prev: function() {
			var len = this.$tabItems.length,
				current = this.current;
			if (current === 0) {
				current = Math.abs(1 - len);
			} else {
				current = current - 1;
			}

			this.active(current);
		},

		destroy: function() {
			// console.log(this.$element)
			this.$element.remove();
			// this.$tabItems.off(this.options.event).removeClass(this.classes.activeTab);
			// this.$paneItems.eq(this.current).removeClass(this.classes.activePanes); 
			// return this;
		}
	};

	// Collection method.
	$.fn.tabs = function(options) {
		if (typeof options === 'string') {
			var method = options;
			var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

			if (/^(getTabs|getPanes|getCurrentPane|getCurrentTab|getIndex)$/.test(method)) {
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