/*! jQuery tabs - v0.3.0 - 2013-09-09
* https://github.com/amazingSurge/jquery-tabs
* Copyright (c) 2013 amazingSurge; Licensed GPL */
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
