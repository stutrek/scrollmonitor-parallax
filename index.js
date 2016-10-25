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

	function getNumber (field, options, ratio) {
		var easing = options.easing[field];
		var start = options.start[field];
		var end = options.end[field];

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

	function OptionsParallax (element, options) {
		this.options = options;
		if (!this.options.start) {
			this.options.start = {};
		}
		if (!this.options.easing) {
			this.options.easing = {};
		}
		this.element = element;
	}

	OptionsParallax.prototype.handleScroll = function (ratio) {
		var transformString = 'translate3D(';
		if (this.options.end.x) {
			transformString += getNumber('x', this.options, ratio) + 'px,';
		} else {
			transformString += '0px,';
		}
		if (this.options.end.y) {
			transformString += getNumber('y', this.options, ratio) + 'px,';
		} else {
			transformString += '0px,';
		}
		if (this.options.end.z) {
			transformString += getNumber('z', this.options, ratio) + 'px)';
		} else {
			transformString += '0px)';
		}

		if (this.options.end.rotate) {
			transformString += ' rotate(' + getNumber('rotate', this.options, ratio) + 'deg)';
		}

		if (this.options.end.scale) {
			transformString += ' scale(' + getNumber('scale', this.options, ratio) + ')';
		}
		this.element.style.transform = transformString;

		if (this.options.end.opacity) {
			this.element.style.opacity = getNumber('opacity', this.options, ratio);
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
				self.items[i].handleScroll.call(self.items[i], self.ratio, self.pxThru);
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
