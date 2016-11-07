import React from 'react';
import ReactDOM from 'react-dom';

import parallax from './index';

export const ParallaxRoot = (Component) => class ParallaxRoot extends React.Component {
	constructor () {
		super();
		this.state = {root: null};
	}

	componentDidMount () {
		var el = ReactDOM.findDOMNode(this);
		this.setState({
			root: parallax.create(el, this.props.parallaxOffsets)
		});
	}

	render () {
		return (<Component {...this.props} parallaxRoot={this.state.root} />);
	}
};

export class ParallaxItem extends React.Component {

	initializeParallax (parallaxRoot) {
		var el = ReactDOM.findDOMNode(this);
		if (this.props.speed) {
			parallaxRoot.add(el, this.props.speed);
		} else {
			var options = {
				start: {},
				end: {},
				easing: {}
			};
			Object.keys(this.props).forEach((prop) => {
				var keyArray = prop.split('-');
				var mainKey = keyArray[0];
				var childKey = keyArray[1];

				switch (mainKey) {
					case 'start':
					case 'end':
					case 'easing':
						options[mainKey] = options[mainKey] || {};
						options[mainKey][childKey] = this.props[prop];
				}
			});
			parallaxRoot.add(el, options);
		}
	}

	componentDidMount () {
		if (this.props.parallaxRoot) {
			this.initializeParallax(this.props.parallaxRoot);
		}
	}

	componentWillReceiveProps (newProps) {
		if (newProps.parallaxRoot && !this.props.parallaxRoot) {
			this.initializeParallax(newProps.parallaxRoot);
		}
	}

	render () {
		return (<div className={this.props.className || ''} data-parallax-item>
			{this.props.children}
		</div>);
	}
}
