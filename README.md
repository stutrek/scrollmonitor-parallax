# Scrollmonitor Parallax

## Installation

```
npm install -S scrollmonitor-parallax
```

## Examples

* [Only one right now](https://stutrek.github.io/scrollmonitor-parallax/tests/index.html)

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

## Existing ScrollMonitor

If you need to create your own `ScrollMonitorContainer`, you may create a parallax root and pass an existing container as the third parameter, and scrollmonitor-parallax will use that instead of using the default `ScrollMonitorContainer` instance:

```javascript
var scrollMonitor = require('scrollmonitor');
var parallax = require('scrollmonitor-parallax');

var container = scrollMonitor.createContainer(document.body);
// Any other watching logic here.
var parallaxRoot = parallax.create(domElement, null, container);
// Any elements you wish to add to your parallax.
```
