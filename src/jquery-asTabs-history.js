// jquery asTabs history
(function(window, document, $, undefined) {
    "use strict";

    if (!window.history || !window.history.pushState || !window.history.replaceState) {
        return;
    }

    var $doc = $(document);
    var id_count = 1;

    $doc.on('asTabs::init', function(event, instance) {
        if (instance.options.history === false) {
            return;
        }
        if (instance.options.history !== true) {
            instance.historyId = instance.options.history;
        } else {
            var id = instance.$element.attr('id');

            if (id) {
                instance.historyId = id;
            } else {
                instance.historyId = 'tabs_' + id_count;
                id_count++;
            }
        }

        // active the matched tab
        var match = new RegExp('[#&]*' + instance.historyId + '=([^&]*)', 'i')
            .exec(window.location.hash);

        if (match) {
            var slug = decodeURIComponent(match[1].replace(/\+/g, ' '));
            var $tab = instance.$nav.find('[' + instance.options.historyAttr + '="' + slug + '"]');

            if ($tab.length >= 1) {
                instance.initialIndex = instance.$tabs.index($tab);
            } else if (!isNaN(parseFloat(slug)) && isFinite(slug)) {
                instance.initialIndex = slug;
            }
        }

        $(window).on('popstate', function(event) {
            var state = event.originalEvent.state;
            if (state && typeof state[instance.historyId] !== 'undefined') {
                if (state[instance.historyId].index) {
                    instance.active(state[instance.historyId].index, false);
                }
                event.preventDefault();
            } else {
                instance.revert(false);
            }
        });
    });

    $doc.on('asTabs::update', function(event, instance) {
        if (instance.options.history === false || typeof instance.historyId === 'undefined') {
            return;
        }
        if (instance.actived === false) {
            return;
        }
        var index = instance.current,
            state = {
                index: index
            },
            content = instance.$tabs.eq(index).attr(instance.options.historyAttr);

        if (content) {
            state.slug = content;
        } else {
            state.slug = index;
        }
        if (index === instance.options.initialIndex) {
            state.initial = true;
        }

        var url = window.location.hash;

        if (url === '') {
            url = '#';
        }

        var reg = new RegExp('&*' + instance.historyId + '=[^&]+', "i");
        if (state.initial) {
            url = url.replace(reg, '');
        } else {
            if (url.match(reg)) {
                url = url.replace(reg, '&' + instance.historyId + '=' + state.slug);
            } else {
                url = url + '&' + instance.historyId + '=' + state.slug;
            }
        }
        var states = history.state;
        if (!states) {
            states = {};
        }
        states[instance.historyId] = state;

        url = url.replace(/^#&/, '#');
        window.history.pushState(states, "", url);
    });
})(window, document, jQuery);
