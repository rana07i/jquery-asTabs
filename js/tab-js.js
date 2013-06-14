;(function(window, document, $, undefined) {
    "use strict";

    // Constructor
    var Tabs = $.Tabs = function(element, options) {
        // Attach element to the 'this' keyword
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

        // Namespacing
        var namespace = this.options.namespace;

        // Class
        this.classes = {};
        this.classes.activeTab = this.options.namespace + '-active';
        this.classes.activePanes = this.options.namespace + '-active';

        this.$tabs = this.$element.find( this.options.tabSelector );
        this.$panes = this.$element.find( this.options.paneSelector );
        this.$element.addClass(this.options.skin);

        var self = this;
        $.extend(self, {
            init: function() {
                self.current = this.options.initialIndex;
                self.active(self.current);

                // Bind logic
                self.$tabs.on(this.options.event, function(e, data) {
                    e.stopPropagation();

                    var index = $(e.target).index();

                    self.active(index);
                });
            },
            another: function(){
            
            
            },

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

        // autoplay: 0,
        // speed : 300,
        // time : 400,

        //effect: 'default';//fade slide ajax

        // pauseOnHover: 0, 

        event : 'click'
    };

    Tabs.prototype = {
        constructor: Tabs,
        // This is a public function that users can call
        // Prototype methods are shared across all elements
        active: function(index){
            // this.$panes.eq(index).css('display','block').siblings().css('display','none');
            this.current = index;

            this.$tabs.eq(index).addClass(this.classes.activeTab).siblings().removeClass(this.classes.activeTab);

            this.$panes.eq(index).addClass(this.classes.activePanes).siblings().removeClass(this.classes.activePanes);
        },

        getTabs: function(){
            return this.$tabs;
        },

        getPanes: function(){
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
            if (current < len-1) {
                current++; 
            } 
            else {
                current = 0;
            }

            // (current < len-1) ? current++ : current = 0;

            this.active(current);

        },

        prev: function() {
            var len = this.$tabs.length,
                current = this.current;
            if (current == 0 ) {
                current = Math.abs( 1 - len );
            } 
            else {
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

            if(/^(getTabs|getPanes|getCurrentPane|getCurrentTab|getIndex)$/.test(method)){
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