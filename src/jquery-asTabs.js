/*
 * jquery-asTabs
 * https://github.com/amazingSurge/jquery-asTabs
 *
 * Copyright (c) 2014 AmazingSurge
 * Licensed under the GPL license.
 */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'asTabs';
    // main constructor
    var Plugin = $[pluginName] = function(element, options) {

        var self = this;

        this.element = element;
        this.$element = $(element);
        this.options = $.extend(true, {}, Plugin.defaults, options, this.$element.data('options'));
        this.namespace = this.options.namespace;
        this.initialIndex = this.options.initialIndex;
        this.initialized = false;
        this.disabled = false;
        this.actived = false;
        this.current = null;

        // Class
        this.classes = {
            withJs: 'with-js',
            activeTab: 'is-active',
            activePane: 'is-active',
            nav: this.namespace + '-nav',
            content: this.namespace + '-content',
            disabled: this.namespace + '-disabled',
            skin: this.namespace + '_' + this.options.skin
        };

        if (this.options.navSelector) {
            this.$nav = this.$element.find(this.options.navSelector);
            this.$content = this.$element.find(this.options.contentSelector)
        } else {
            this.$nav = this.$element;
            if (this.options.contentSelector === '+') {
                this.$content = this.$nav.next();
            } else {
                this.$content = $(this.options.contentSelector);
            }
        }

        this.$nav.addClass(this.classes.nav).addClass(this.classes.withJs);
        this.$content.addClass(this.classes.content).addClass(this.classes.withJs);

        this.$tabs = this.$nav.children();
        this.$panes = this.$content.children();
        this.$loading = $('<span class="' + this.namespace + '-loading"></span>');

        this.size = this.$tabs.length;

        if (this.options.skin) {
            this.$element.addClass(this.classes.skin);
            this.$content.addClass(this.classes.skin);
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
    Plugin.defaults = {
        namespace: 'asTabs',
        navSelector: null,
        contentSelector: '+',
        skin: null,
        initialIndex: 0,
        ajax: false,
        cached: false,
        history: false,
        historyAttr: 'id',
        keyboard: false,
        effect: false,
        duration: 300,
        event: 'click'
    };
    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            var self = this;

            // Bind logic
            this.$nav.on(this.options.event, '> *', function(e) {
                if (self.disabled) {
                    return false;
                }
                var index = $(e.target).index();
                self.active(index);
                return false;
            });

            this._trigger('init');

            this.active(this.initialIndex);
            this.actived = true;

            this.initialized = true;

            this._trigger('ready');
        },
        _trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$element.trigger(pluginName + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        active: function(index, update) {
            if (this.current >= 0) {
                if (this.current === index || index >= this.size || index < 0) {
                    return;
                }
            } else {
                if (index >= this.size) {
                    index = this.size - 1;
                } else if (index < 0) {
                    index = 0;
                }
            }

            this.$tabs.eq(index).addClass(this.classes.activeTab).siblings().removeClass(this.classes.activeTab);

            var self = this;

            if (this.current === null) {
                this.$panes.eq(index).addClass(this.classes.activePane).siblings().removeClass(this.classes.activePane);
            } else {
                self._trigger('animation', self.current, index);

                if (!self.effects) {
                    self.$panes.eq(self.current).fadeOut(self.options.duration, function() {
                        $(this).removeClass('is-active');

                        self.$panes.eq(index).fadeIn(self.options.duration, function() {
                            $(this).addClass('is-active');
                        });
                    });
                }
            }

            self.previous = self.current;
            self.current = index;

            if (self.options.ajax === true) {
                self.ajaxLoad(index);
            }

            self._trigger('active', index);

            if (update !== false) {
                self._trigger('update', index);
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
                dtd.always(function() {
                    self._trigger('loaded', index);
                });
            }
        },
        showLoading: function() {
            this.$loading.appendTo(this.$content);
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
        getSize: function() {
            return this.size;
        },
        append: function(title, content) {
            return this.add(title, content, this.size);
        },
        add: function(title, content, index) {
            if (index > this.size + 1) {
                index = this.size + 1;
            } else if (index < 0) {
                index = 0;
            }

            if (index === 0) {
                this.$nav.append($('<li/>', {
                    class: this.classes.activeTab
                }).html(title));
                this.$content.append($('<div/>', {
                    class: this.classes.activePane
                }).html(content));
                this.current = 0;
            } else {
                this.$tabs.eq(index - 1).after(this.$tabs.eq(0).clone().removeClass(this.classes.activeTab).html(title));
                this.$panes.eq(index - 1).after(this.$panes.eq(0).clone().removeClass(this.classes.activePane).html(content));
            }

            this.$tabs = this.$nav.children();
            this.$panes = this.$content.children();
            this.size++;

            return this;
        },
        remove: function(index) {
            if (index > this.size || index < 0 || this.size === 0) {
                return this;
            }
            this.$tabs.eq(index).remove();
            this.$panes.eq(index).remove();

            this.$tabs = this.$nav.children();
            this.$panes = this.$content.children();
            this.size--;

            if (this.current === index) {
                if (index > this.size) {
                    index = 0;
                }
                this.active(index);
            }
            return this;
        },
        next: function() {
            var current = this.current;
            if (current < this.size - 1) {
                current++;
            } else {
                current = 0;
            }

            this.active(current);

            return this;
        },
        prev: function() {
            var current = this.current;
            if (current === 0) {
                current = Math.abs(1 - this.size);
            } else {
                current = current - 1;
            }

            this.active(current);

            return this;
        },
        revert: function(update) {
            var index = 0;
            if (this.options.initialIndex) {
                index = this.options.initialIndex;
            }

            this.active(index, update);

            return this;
        },
        enable: function() {
            if (this.disabled === true) {
                this.disabled = false;
                this.$nav.removeClass(this.classes.disabled);
                this.$content.removeClass(this.classes.disabled);
            }
            return this;
        },
        disable: function() {
            if (this.disabled === false) {
                this.disabled = true;
                this.$nav.addClass(this.classes.disabled);
                this.$content.addClass(this.classes.disabled);
            }
            return this;
        },
        destroy: function() {
            this.$nav.removeClass(this.classes.nav).removeClass(this.classes.withJs);
            this.$content.removeClass(this.classes.content).removeClass(this.classes.withJs);

            this.$tabs.removeClass(this.classes.activeTab);
            this.$panes.removeClass(this.classes.activePane);
            this.$nav.off(this.options.event);
            $.data(this.$element, pluginName, null);
        }
    };
    // Collection method.
    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if (/^(getTabs|getPanes|getCurrentPane|getCurrentTab|getIndex|getSize)$/.test(method)) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);
