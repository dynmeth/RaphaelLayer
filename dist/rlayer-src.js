(function() {

var R, originalR;

if (typeof exports != 'undefined') {
	R = exports;
} else {
	R = {};

	originalR = window.R;

	R.noConflict = function() {
		window.R = originalR;
		return R;
	};

	window.R = R;
}

R.version = '0.1';

R.Layer = L.Class.extend({
	initialize: function(options) {
		
	},

	onAdd: function (map) {
		this._map = map;
		this._map._initRaphaelRoot();
		this._paper = this._map._paper;

		map.on('viewreset', this.projectLatLngs, this);
		this.projectLatLngs();
	},

	onRemove: function(map) {
		
	},

	projectLatLngs: function() {
		
	}
});

L.Map.include({
	_initRaphaelRoot: function () {
		if (!this._raphaelRoot) {
			this._raphaelRoot = document.createElement('div');
			this._raphaelRoot.className = 'leaflet-raphael-pane';
			this._panes.overlayPane.appendChild(this._raphaelRoot);
			this._paper = Raphael(this._raphaelRoot);

			this.on('moveend', this._updateRaphaelViewport);
			this._updateRaphaelViewport();
		}
	},

	_updateRaphaelViewport: function () {
		var	p = 0.5,
			size = this.getSize(),
			panePos = L.DomUtil.getPosition(this._mapPane),
			min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)),
			max = min.add(size.multiplyBy(1 + p*2)),
			width = max.x - min.x,
			height = max.y - min.y,
			root = this._raphaelRoot,
			pane = this._panes.overlayPane;

		if (L.Browser.webkit) {
			pane.removeChild(root);
		}

		this._paper.setSize(width, height);
		
		L.DomUtil.setPosition(root, min);
		root.setAttribute('width', width);
		root.setAttribute('height', height);

		if (L.Browser.webkit) {
			this._paper.setViewBox(min.x, min.y, width, height);

			pane.appendChild(root);
		}
	}
});

R.Marker = R.Layer.extend({
	initialize: function(latlng, pathString, attr, options) {
		R.Layer.prototype.initialize.call(this, options);

		this._latlng = latlng;
		this._pathString = (typeof pathString == 'string' ? pathString : 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z');
		this._attr = (typeof pathString == 'object' ? pathString : (attr ? attr : {'fill': '#000'}));
	},

	projectLatLngs: function() {		
		if (this.path) this.path.remove();

		var p = this._map.latLngToLayerPoint(this._latlng);
		var r = Raphael.pathBBox(this._pathString);
		
		this.path = this._paper.path(this._pathString)
			.attr(this._attr)
			.translate(p.x - 1.05*r.width, p.y - 1.15*r.height)
			.toFront();
	}
});

R.Pulse = R.Layer.extend({
	initialize: function(latlng, radius, attr, pulseAttr, options) {
		R.Layer.prototype.initialize.call(this, options);
		console.log(pulseAttr);
		this._latlng = latlng;
		this._radius = (typeof radius == 'number' ? radius : 6);
		this._attr = (typeof radius == 'object' ? radius : (typeof attr == 'object' ? attr : {'fill': '#30a3ec', 'stroke': '#30a3ec'}));
		this._pulseAttr = (typeof radius == 'object' ? attr : typeof pulseAttr == 'object' ? pulseAttr : {
			'stroke-width': 3,
			'stroke': this._attr.stroke
		});
		this._repeat = 3;
	},

	onRemove: function (map) {
		if(this.marker) this.marker.remove();		
		if(this.pulse) this.marker.remove();

		R.Layer.prototype.onRemove.call(this, map);
	},

	projectLatLngs: function() {
		var self = this;

		if(this.marker) this.marker.remove();
		if(this.pulse) this.pulse.remove();

		var p = this._map.latLngToLayerPoint(this._latlng);

		this.marker = this._paper.circle(p.x, p.y, this._radius).attr(this._attr);
		this.pulse = this._paper.circle(p.x, p.y, this._radius).attr(this._pulseAttr);

		var anim = Raphael.animation({
						'0%': {transform: 's0.3', opacity: 1.0},
						'100%': {transform: 's3.0', opacity: 0.0, easing: '<'} //, callback: anim}
					}, 1000);

		this.pulse.animate(anim.repeat(this._repeat));
	}
});

R.Polyline = R.Layer.extend({
	initialize: function(latlngs, attr, options) {
		R.Layer.prototype.initialize.call(this, options);

		this._latlngs = latlngs;
		this._attr = attr || {'fill': '#000', 'stroke': '#000'};
	},

	projectLatLngs: function() {	
		if (this._path) this._path.remove();
		
		this._path = this._paper.path(this.getPathString())
			.attr(this._attr)
			.toBack();
	},

	getPathString: function() {
		for(var i=0, len=this._latlngs.length, str=''; i<len; i++) {
			var p = this._map.latLngToLayerPoint(this._latlngs[i]);
			str += (i ? 'L' : 'M') + p.x + ' ' + p.y;
		}
		return str;
	}
});

R.Bezier = R.Layer.extend({
	initialize: function(latlngs, attr, options) {
		R.Layer.prototype.initialize.call(this, options);

		this._latlngs = latlngs;
		this._attr = attr;
	},

	onRemove: function (map) {
		if(this._path) this._path.remove();

		L.Layer.prototype.onRemove.call(this, map);
	},

	projectLatLngs: function() {
		if(this._path) this._path.remove();
		
		var start = this._map.latLngToLayerPoint(this._latlngs[0]),
			end = this._map.latLngToLayerPoint(this._latlngs[1]),
			cp = this.getControlPoint(start, end);

		this._path = this._paper.path('M' + start.x + ' ' + start.y + 'Q' + cp.x + ' ' + cp.y + ' ' + end.x + ' ' + end.y)
			.attr(this._attr)
			.toBack();
	},

	getControlPoint: function(start, end) {
		var cp = { x: 0, y: 0 };
		cp.x = start.x + (end.x - [start.x]) / 2;
		cp.y = start.y + (end.y - [start.y]) / 2;
		var amp = 0;

		if (this.closeTo(start.x, end.x) && !this.closeTo(start.y, end.y)) {
			amp = (start.x - end.x) * 1 + 15 * (start.x >= end.x ? 1 : -1);
			cp.x = Math.max(start.x, end.x) + amp;
		} else {
			amp = (end.y - start.y) * 1.5 + 15 * (start.y < end.y ? 1 : -1);
			cp.y = Math.min(start.y, end.y) + amp;
		}
		return cp;
	},

	closeTo: function(a, b) {
		var t = 15;
  		return (a - b > -t && a - b < t);
	}
});



}());