// jquery tabs history
;(function(window, document, $, undefined) {
    var $doc = $(document);
    var history = {
        states: {},
        reflash: false,
        pushState: function(state) {
            for (id in state) {
                this.states[id] = state[id];
            }
            this.reflash = false;
            setTimeout($.proxy(this.changeStates,this), 0);
        },
        changeStates: function() {
            var hash = '';
            if (this.reflash === true) {
                return;
            }

            $.each(this.states, function(id,index) {
                hash += id + '=' + index + '&';
            });

            window.location.hash =  hash.substr(0, hash.length - 1);
            this.reflash = true;
        },
        getState: function() {
            var hash = window.location.hash.replace('#','').replace('!',''),
                queryString, param = {};

            if (hash ==='') {
                return {};
            }

            queryString = hash.split("&");

            $.each(queryString, function(i,v) {
                if (v == false) {
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
            if (this.reflash === true) {
                return;
            }
            this.states = {};
            window.location.hash = "#/";

            this.reflash = true;
        }
    };

    $doc.on('tabs::init', function(event, instance) {
        if (instance.options.history === false) {
            return;
        }
        $(window).on('hashchange.tabs', function(e) {
            var states = history.getState(),
                tabs,
                id = instance.$element.attr('id'); 

            if (states[id]) {
                tabs = $('#'+id).data('tabs');
                if (tabs) {
                    var $tab = instance.$element.find('#' + states[id]);
                    if ($tab.length >= 1) {
                        $tab.click();
                    } else {
                        tabs.active(states[id]);
                    }
                    
                }
            }
        });   
    });

    $doc.on('tabs::afterActive', function(event, instance) {
        var index = instance.current, state = {},
            id = instance.$element.attr('id'),
            content = instance.$tabItems.eq(index).attr('id'); 

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
    },0);
})(window, document, jQuery);
