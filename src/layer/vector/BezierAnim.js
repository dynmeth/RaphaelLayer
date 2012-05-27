R.BezierAnim = R.Layer.extend({
	initialize: function(latlngs, attr, cb, options) {
		R.Layer.prototype.initialize.call(this, options);

		this._latlngs = latlngs;
		this._attr = attr;
		this._cb = cb;
	},

	onRemove: function (map) {
		R.Layer.prototype.onRemove.call(this, map);
		
		if(this._path) this._path.remove();
		if(this._sub) this._sub.remove();
	},

	projectLatLngs: function() {
		if(this._path) this._path.remove();
		if(this._sub) this._sub.remove();
		
		var start = this._map.latLngToLayerPoint(this._latlngs[0]),
			end = this._map.latLngToLayerPoint(this._latlngs[1]),
			cp = this.getControlPoint(start, end),
			pathString = 'M' + start.x + ' ' + start.y + 'Q' + cp.x + ' ' + cp.y + ' ' + end.x + ' ' + end.y,
			line = this._paper.path(pathString),
			len = line.getTotalLength();

		this._path = line.attr({'opacity': 0});

		this._paper.customAttributes.alongBezier = function(a) {
			return {
				path: line.getSubpath(0, a*len)
			};
		};

		this._sub = this._paper.path()
			.attr({
				'stroke': '#f00',
				'alongBezier': 0,
				'stroke-width': 3
			});

		this._sub.stop().animate({
			alongBezier: 1
		}, 500, this._cb);
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