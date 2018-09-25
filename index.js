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

	function CallbackParallax (element, callback) {
		this.element = element;
		this.callback = callback;
	}
	
	CallbackParallax.prototype.handleScroll = function (ratio, distance, watcher) {
		this.callback(ratio, distance, watcher)
	};
	
	function OptionsParallax (element, options, container) {
		container = container || scrollMonitor;
		this.options = options;
		if (!this.options.start) {
			this.options.start = {};
		}
		if (!this.options.easing) {
			this.options.easing = {};
		}

		if (this.options.end.bottom !== undefined) {
			this.watcher = container.create(element);
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

	function Root (element, offsets, container) {
		this.container = container || scrollMonitor;
		this.watcher = this.container.create(element, offsets);
		this.items = [];

		this.pxThru = 0;
		this.ratio = 0;

		var self = this;
		var scrollContainer = this.container.item === document.body ? window : this.container.item;

		function handleScroll () {
			var start = Math.max(0, self.watcher.top - self.container.viewportHeight);
			var end = Math.min(self.watcher.bottom, self.container.documentHeight - self.container.viewportHeight);

			self.pxThru = Math.max(0, self.container.viewportTop - start);
			self.ratio = self.pxThru / (end - start);

			for (var i=0; i < self.items.length; i++) {
				self.items[i].handleScroll.call(self.items[i], self.ratio, self.pxThru, self.watcher);
			}
		}

		this.watcher.enterViewport(function () {
			scrollContainer.addEventListener('scroll', handleScroll);
		});
		this.watcher.exitViewport(function () {
			scrollContainer.removeEventListener('scroll', handleScroll);
		});
	}

	Root.prototype.add = function add (element, optionsOrSpeed) {
		var newItem;
		if (typeof optionsOrSpeed === 'number') {
			newItem = new SpeedParallax(element, optionsOrSpeed);
		} else if (typeof optionsOrSpeed === 'function') {
			newItem = new CallbackParallax(element, optionsOrSpeed);
		} else {
			newItem = new OptionsParallax(element, optionsOrSpeed, this.container);
		}

		this.items.push(newItem);
	};
	
	Root.prototype.destroy = function () {
		if (this.watcher) {
			this.items = []
			this.watcher.destroy()
		}
	}

	return {
		create: function (item, offsets, container) {
			return new Root(item, offsets, container);
		}
	};
});
