/*
 * jquery-tabs
 * https://github.com/amazingSurge/jquery-tabs
 *
 * Copyright (c) 2013 Wowhoo
 * Licensed under the MIT license.
 */

;
(function(window, document, $, undefined) {
    "use strict";

    var css3Transition = true;
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

        // Class
        this.classes = {
            activeTab: this.namespace + '-tabs_active',
            activePanes: this.namespace + '-panes_active',
            effect: this.namespace + '-' + this.options.effect,
            show: this.namespace + '-' + this.options.effect + '-show'
        };

        this.$tabs = this.$element.find(this.options.tabSelector);
        this.$panes = this.$element.find(this.options.paneSelector);
        this.$panesBox = this.$element.children('div');
        this.$loading = $('<span class="' + this.namespace + '-loading"></span>');

        this.$element.addClass(this.options.skin).addClass(this.classes.effect);

        
        if (this.options.ajax === true) {
            this.ajax = [];
            $.each(this.$tabs, function(i,v) {
                var obj = {};
                obj.href = $(v).data('href');
                self.ajax.push(obj);
            });
        }

        $.extend(self, {
            init: function() {
                self.current = this.options.initialIndex;
                self.active(self.current);

                // Bind logic
                self.$tabs.on(this.options.event, function(e, data) {
                    var index = $(e.target).index();
                    self.active(index);
                    return false;
                });
            },
            another: function() {

            }
        });

        self.init();
    };


    // Default options for the plugin as a simple object
    Tabs.defaults = {
        namespace: 'tabs',

        tabSelector: '.tabs > li',
        paneSelector: '.panes > div',

        skin: null,
        initialIndex: 0,
        
        effect: 'fade',

        ajax: false,
        cached: false,

        event: 'click'
    };

    Tabs.prototype = {
        constructor: Tabs,
        // This is a public function that users can call
        // Prototype methods are shared across all instances
        active: function(index) {
            var self = this;

            if (this.options.ajax === true) {
                this.ajaxLoad(index);
            }

            // this.$panes.eq(index).css('display','block').siblings().css('display','none');
            this.current = index;
            this.$tabs.eq(index).addClass(this.classes.activeTab).siblings().removeClass(this.classes.activeTab);
            this.$panes.eq(index).addClass(this.classes.activePanes).siblings().removeClass(this.classes.activePanes);

            this.$panes.removeClass(this.classes.show);

            setTimeout(function() {
                self.$panes.eq(index).addClass(self.classes.show);
            }, 0);
        },

        ajaxLoad: function(index) {
            var self = this, dtd;
            if (this.options.cached === true && this.ajax[index].cached === true) {
                return;
            } else {
                this.showLoading();
                dtd = $.ajax({url: this.ajax[index].href});
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
            this.$loading.appendTo(this.$panesBox);
        },
        hideLoading: function() {
            this.$loading.remove();
        },

        getTabs: function() {
            return this.$tabs;
        },

        getPanes: function() {
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

        next: function() {
            var len = this.$tabs.length,
                current = this.current;
            if (current < len - 1) {
                current++;
            } else {
                current = 0;
            }

            // (current < len-1) ? current++ : current = 0;

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
            // console.log(this.$element)
            this.$element.remove();
            // this.$tabs.off(this.options.event).removeClass(this.classes.activeTab);
            // this.$panes.eq(this.current).removeClass(this.classes.activePanes); 
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
