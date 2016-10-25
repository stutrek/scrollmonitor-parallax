# Scrollmonitor Parallax

## Installation

```
npm install -S scrollmonitor-parallax
```

## Examples

* [https://stutrek.github.io/scrollmonitor-parallax/tests]

## Basic Usage

```javascript
var parallax = require('scrollmonitor-parallax');
var eases = require('eases'); // https://github.com/mattdesl/eases


// Create a root element. Parallax will start when this
// element enters the viewport and stop when it exits.
var parallaxRoot = parallax.create(domElement);

// to make an element scroll at a speed relative to the
// scroll parent, just add a value for speed.
var parallaxChild2 = parallaxRoot.add(domElement, 0.5);

// for more complex animations you can start and end positions.
// If it's left blank, the start position is taken from the element's CSS.
var parallaxChild = parallaxRoot.add(
    domElement, {
	    start: {
	    	opacity: 0
		}
	    end: {
	        x: 100,
	        y: 50,
	        z: 100,
	        opacity: 0.7
	    },
	    easing: {
	        x: eases.linear,
	        y: eases.linear,
	        z: eases.circIn,
	        opacity: eases.bounceIn
	    }
    }
);

```
