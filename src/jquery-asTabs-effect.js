// elementTransitions
(function(window, document, $, undefined) {
    "use strict";

    var $doc = $(document);

    var revertClass = function(str) {
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
            output += " " + classes[n];
        }
        return $.trim(output);
    };

    var animationend = (function() {
        var t;
        var el = document.createElement('fakeelement');
        var animations = {
            'animation': 'animationend',
            '-o-animation': 'oAnimationEnd',
            '-moz-animation': 'animationend',
            '-webkit-animation': 'webkitAnimationEnd'
        };

        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }

        return false;
    })();

    if (animationend === false) return;

    $doc.on('asTabs::init', function(event, instance) {
        if (instance.options.effect === false) {
            return false;
        }

        instance.effects = {
            inClass: instance.options.effect,
            outClass: revertClass(instance.options.effect)
        };

        instance.$content.children().css({
            '-webkit-animation-duration': instance.options.duration + 'ms',
            'animation-duration': instance.options.duration + 'ms'
        })
        instance.$content.addClass('with-effects');
    });

    $doc.on('asTabs::ready', function(event, instance) {
        if (instance.options.effect === false) {
            return false;
        }
        $(window).bind('resize orientationchange', function() {
            clearTimeout(instance.resizingTimeout);
            instance.resizingTimeout = setTimeout(function() {
                var height = instance.getCurrentPane().outerHeight(true);

                instance.$content.height(height);
            }, 500);
        });
    });

    $doc.on('asTabs::active asTabs::loaded', function(event, instance) {
        if (instance.options.effect === false) {
            return false;
        }

        var height = instance.getCurrentPane().outerHeight(true);
        instance.$content.height(height);
    });

    $doc.on('asTabs::animation', function(event, instance, from, to) {
        if (instance.options.effect === false || instance.initialized === false) {
            return false;
        }

        var $to = instance.$panes.eq(to),
            $from = instance.$panes.eq(from);

        instance.isAnimating = true;

        $from.removeClass(instance.effects.inClass).addClass(instance.effects.outClass + ' animated').one(animationend, function() {
            $from.removeClass(instance.effects.outClass + ' animated').removeClass('is-active');

            $to.removeClass(instance.effects.outClass).addClass('is-active').addClass(instance.effects.inClass + ' animated').one(animationend, function() {
                $to.removeClass(instance.effects.inClass);

                instance.isAnimating = false;
            });
        });
    });
})(window, document, jQuery);
