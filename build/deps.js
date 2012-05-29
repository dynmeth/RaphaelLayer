var deps = {
	Core: {
		src: ['RaphaelLayer.js'],
		desc: 'The core of the Raphael Leaflet layer.'
	},

	Layer: {
		src: ['layer/vector/Layer.Raphael.js'],
		desc: 'Vector rendering core (Raphael-powered), enables overlaying the map with SVG paths and animation.',
		heading: 'Vector layers'
	},

	Marker: {
		src: ['layer/vector/Marker.js'],
		deps: ['Layer'],
		desc: 'Marker overlay with a standard SVG icon'
	},

	Pulse: {
		src: ['layer/vector/Pulse.js'],
		deps: ['Layer'],
		desc: 'Animated pulse marker overlay'
	},

	Polyline: {
		src: ['layer/vector/Polyline.js'],
		deps: ['Layer'],
		desc: 'Straight lines connecting n latlngs.'
	},

	Polygon: {
		src: ['layer/vector/Polygon.js'],
		deps: ['Layer'],
		desc: 'Straight lines connecting n latlngs and closing the last latlng with the first.'
	},

	PolygonGlow: {
		src: ['layer/vector/PolygonGlow.js'],
		deps: ['Layer'],
		desc: 'Straight lines connecting n latlngs and closing the last latlng with the first with \'glowing\' animation.'
	},

	Bezier: {
		src: ['layer/vector/Bezier.js'],
		deps: ['Layer'],
		desc: 'Quadratic bezier line.'
	},

	BezierAnim: {
		src: ['layer/vector/BezierAnim.js'],
		deps: ['Layer'],
		desc: 'Quadratic bezier line animated.'
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}