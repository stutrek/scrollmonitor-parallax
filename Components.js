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
			root: parallax.create(el)
		});
	}

	render () {
		return (<Component {...this.props} parallaxRoot={this.state.root} />);
	}
};

export class ParallaxItem extends React.Component {

	initializeParallax (parallaxRoot) {
		var el = ReactDOM.findDOMNode(this);
		parallaxRoot.add(el, this.props.speed);
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
