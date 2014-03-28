/*! jQuery asTabs - v0.3.0 - 2013-09-09
 * https://github.com/amazingSurge/jquery-asTabs
 * Copyright (c) 2013 amazingSurge; Licensed GPL */

(function(window, document, $, undefined) {
    "use strict";

    // Constructor
    var AsTabs = $.asTabs = function(element, options) {
        var self = this;

        this.element = element;
        this.$element = $(element);

        // options
        var meta_data = [];
        $.each(this.$element.data(), function(k, v) {
            var re = new RegExp("^asTabs", "i");
            if (re.test(k)) {
                meta_data[k.toLowerCase().replace(re, '')] = v;
            }
        });

        this.options = $.extend(true, {}, AsTabs.defaults, options, meta_data);
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
        this.$loading = $('<span class="' + this.namespace + '-loading"></span>');

        this.size = this.$tabs.length;

        if (this.options.skin) {
            this.$element.addClass(this.classes.skin);
            this.$panes_wrap.addClass(this.classes.skin);
        }


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
    AsTabs.defaults = {
        namespace: 'asTabs',
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

    AsTabs.prototype = {
        constructor: AsTabs,
        init: function() {
            var self = this;

            // Bind logic
            this.$element.on(this.options.event, '> *', function(e) {
                var index = $(e.target).index();
                self.active(index);
                self.afterActive();
                return false;
            });

            this.$element.trigger('asTabs::init', this);

            this.active(this.options.initialIndex);
            this.initialized = true;

            this.$element.trigger('asTabs::ready', this);
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

            this.$element.trigger('asTabs::active', this);

            if ($.type(this.options.onActive) === 'function') {
                this.options.onActive(this);
            }

            if (this.options.ajax === true) {
                this.ajaxLoad(index);
            }
        },
        afterActive: function() {
            this.$element.trigger('asTabs::afterActive', this);
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
        enable: function() {},
        disable: function() {},
        destroy: function() {}
    };

    // Collection method.
    $.fn.asTabs = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            if (/^(getTabs|getPanes_wrap|getCurrentPane|getCurrentTab|getIndex)$/.test(method)) {
                var api = this.first().data('asTabs');
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, 'asTabs');
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, 'asTabs')) {
                    $.data(this, 'asTabs', new AsTabs(this, options));
                }
            });
        }
    };
}(window, document, jQuery));