'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ParallaxItem = exports.ParallaxRoot = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParallaxRoot = exports.ParallaxRoot = function ParallaxRoot(Component) {
	return function (_React$Component) {
		_inherits(ParallaxRoot, _React$Component);

		function ParallaxRoot() {
			_classCallCheck(this, ParallaxRoot);

			var _this = _possibleConstructorReturn(this, (ParallaxRoot.__proto__ || Object.getPrototypeOf(ParallaxRoot)).call(this));

			_this.state = { root: null };
			return _this;
		}

		_createClass(ParallaxRoot, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				var el = _reactDom2.default.findDOMNode(this);
				this.setState({
					root: _index2.default.create(el, this.props.parallaxOffsets)
				});
			}
		}, {
			key: 'render',
			value: function render() {
				return _react2.default.createElement(Component, _extends({}, this.props, { parallaxRoot: this.state.root }));
			}
		}]);

		return ParallaxRoot;
	}(_react2.default.Component);
};

var ParallaxItem = exports.ParallaxItem = function (_React$Component2) {
	_inherits(ParallaxItem, _React$Component2);

	function ParallaxItem() {
		_classCallCheck(this, ParallaxItem);

		return _possibleConstructorReturn(this, (ParallaxItem.__proto__ || Object.getPrototypeOf(ParallaxItem)).apply(this, arguments));
	}

	_createClass(ParallaxItem, [{
		key: 'initializeParallax',
		value: function initializeParallax(parallaxRoot) {
			var _this3 = this;

			var el = _reactDom2.default.findDOMNode(this);
			if (this.props.speed) {
				parallaxRoot.add(el, this.props.speed);
			} else {
				var options = {
					start: {},
					end: {},
					easing: {}
				};
				Object.keys(this.props).forEach(function (prop) {
					var keyArray = prop.split('-');
					var mainKey = keyArray[0];
					var childKey = keyArray[1];

					switch (mainKey) {
						case 'start':
						case 'end':
						case 'easing':
							options[mainKey] = options[mainKey] || {};
							options[mainKey][childKey] = _this3.props[prop];
					}
				});
				parallaxRoot.add(el, options);
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (this.props.parallaxRoot) {
				this.initializeParallax(this.props.parallaxRoot);
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(newProps) {
			if (newProps.parallaxRoot && !this.props.parallaxRoot) {
				this.initializeParallax(newProps.parallaxRoot);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: this.props.className || '', 'data-parallax-item': true },
				this.props.children
			);
		}
	}]);

	return ParallaxItem;
}(_react2.default.Component);

//# sourceMappingURL=Components.js.map