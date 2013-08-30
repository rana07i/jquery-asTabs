// jquery tabs keyboard
;
(function(window, document, $, undefined) {
	var $doc = $(document);
	var keyboard = {
		keys: {
			'UP': 38,
			'DOWN': 40,
			'LEFT': 37,
			'RIGHT': 39,
			'RETURN': 13,
			'ESCAPE': 27,
			'BACKSPACE': 8,
			'SPACE': 32,
			'HOME':36,
			'END':35
		},
		map: {},
		bound: false,
		press: function(e) {
			var key = e.keyCode || e.which;
			if (key in keyboard.map && typeof keyboard.map[key] === 'function') {
				e.preventDefault();
				return keyboard.map[key].call(self, e);
			}
		},
		attach: function(map) {
			var key, up;
			for (key in map) {
				if (map.hasOwnProperty(key)) {
					up = key.toUpperCase();
					if (up in keyboard.keys) {
						keyboard.map[keyboard.keys[up]] = map[key];
					} else {
						keyboard.map[up] = map[key];
					}
				}
			}
			if (!keyboard.bound) {
				keyboard.bound = true;
				$doc.bind('keydown', keyboard.press);
			}
		},
		detach: function() {
			keyboard.bound = false;
			keyboard.map = {};
			$doc.unbind('keydown', keyboard.press);
		}
	};

	$doc.on('tabs::init', function(event, instance) {
		if (instance.options.keyboard === false) {
			return;
		}

		// make ul div etc. get focus
		instance.$element.add(instance.$panes).attr('tabindex', '0').on('focus', function(e) {
			keyboard.attach({
				left: $.proxy(instance.prev, instance),
				right: $.proxy(instance.next, instance),
				home: $.proxy(instance.active, instance, 0),
				end: $.proxy(instance.active, instance, instance.size-1),
			});
			return false;
		}).on('blur', function(e) {
			keyboard.detach();
			return false;
		});

	});
})(window, document, jQuery);