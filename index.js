(function( factory ) {
	if (typeof define !== 'undefined' && define.amd) {
		define(['scrollmonitor'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require('scrollmonitor'));
	} else {
		window.parallax = factory(window.scrollMonitor);
	}
})(function (scrollMonitor) {

	function SpeedParallax (element, speed) {
		this.speed = speed;
		this.element = element;
	}

	SpeedParallax.prototype.handleScroll = function (ratio, distance) {
		var pixels = distance * this.speed;
		this.element.style.transform = 'translateY(' + pixels + 'px)';
	};

	function getNumber (easing, start, end, ratio) {

		if (easing) {
			ratio = easing(ratio);
		}

		if (!start) {
			return end * ratio;
		}

		var difference = end - start;
		var change = difference * ratio;
		return start + change;
	}

	function getY (options, ratio, rootHeight, itemHeight) {

		var start = options.start.y || 0;
		if (!start && options.start.bottom !== undefined) {
			start = rootHeight - itemHeight - options.start.bottom;
		}

		var end = options.end.y;
		if (!end && options.end.bottom !== undefined) {
			end = rootHeight - itemHeight - options.end.bottom;
		}

		var easing = options.easing.y || options.easing.bottom;

		return getNumber(easing, start, end, ratio);
	}

	function getField (field, options, ratio) {
		var easing = options.easing[field];
		var start = options.start[field];
		var end = options.end[field];

		return getNumber(easing, start, end, ratio);
	}

	function OptionsParallax (element, options) {
		this.options = options;
		if (!this.options.start) {
			this.options.start = {};
		}
		if (!this.options.easing) {
			this.options.easing = {};
		}

		if (this.options.end.bottom !== undefined) {
			this.watcher = scrollMonitor.create(element);
		} else {
			this.watcher = {};
		}
		this.element = element;
	}

	OptionsParallax.prototype.handleScroll = function (ratio, pxThru, rootWatcher) {
		var transformString = 'translate3D(';
		if (this.options.end.x !== undefined) {
			transformString += getField('x', this.options, ratio) + 'px,';
		} else {
			transformString += '0px,';
		}
		if (this.options.end.y !== undefined || this.options.end.bottom !== undefined) {
			transformString += getY(this.options, ratio, rootWatcher.height, this.watcher.height) + 'px,';
		} else {
			transformString += '0px,';
		}
		if (this.options.end.z !== undefined) {
			transformString += getField('z', this.options, ratio) + 'px)';
		} else {
			transformString += '0px)';
		}

		if (this.options.end.rotate !== undefined) {
			transformString += ' rotate(' + getField('rotate', this.options, ratio) + 'deg)';
		}

		if (this.options.end.scale !== undefined) {
			transformString += ' scale(' + getField('scale', this.options, ratio) + ')';
		}

		this.element.style.transform = transformString;

		if (this.options.end.opacity !== undefined) {
			this.element.style.opacity = getField('opacity', this.options, ratio);
		}
	};

	function Root (element, offsets) {
		this.watcher = scrollMonitor.create(element, offsets);
		this.items = [];

		this.pxThru = 0;
		this.ratio = 0;

		var self = this;

		function handleScroll () {
			var start = Math.max(0, self.watcher.top - scrollMonitor.viewportHeight);
			var end = Math.min(self.watcher.bottom, scrollMonitor.documentHeight - scrollMonitor.viewportHeight);

			self.pxThru = Math.max(0, scrollMonitor.viewportTop - start);
			self.ratio = self.pxThru / (end - start);

			for (var i=0; i < self.items.length; i++) {
				self.items[i].handleScroll.call(self.items[i], self.ratio, self.pxThru, self.watcher);
			}
		}

		this.watcher.enterViewport(function () {
			window.addEventListener('scroll', handleScroll);
		});
		this.watcher.exitViewport(function () {
			window.removeEventListener('scroll', handleScroll);
		});
	}

	Root.prototype.add = function add (element, optionsOrSpeed) {
		var newItem;
		if (typeof optionsOrSpeed === 'number') {
			newItem = new SpeedParallax(element, optionsOrSpeed);
		} else {
			newItem = new OptionsParallax(element, optionsOrSpeed);
		}

		this.items.push(newItem);
	};

	return {
		create: function (item, offsets) {
			return new Root(item, offsets);
		}
	};
});
