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

            $currPage.removeClass(this.inClass).addClass(this.outClass).on(this.animEndEventName, function() {
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
            $inpage.removeClass(this.inClass).addClass('et-page-current');
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
    $doc.on('asTabs::init', function(event, instance) {
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

    $doc.on('asTabs::active', function(event, instance) {
        if (instance.options.effect === false || instance.initialized === false) {
            return false;
        }
        instance.effects.animate(instance.last, instance.current);
    });
})(window, document, jQuery);