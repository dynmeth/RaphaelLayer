R.Bezier = R.Layer.extend({
	initialize: function(latlngs, attr, options) {
		R.Layer.prototype.initialize.call(this, options);

		this._latlngs = latlngs;
		this._attr = attr;
	},

	projectLatLngs: function() {
		if(this._path) this._path.remove();

        var start = this._map.latLngToLayerPoint(this._latlngs[0]),
            end = this._map.latLngToLayerPoint(this._latlngs[1]),
            cp = this.getControlPoints(start, end);

        this._path = this._paper.path('M' + start.x + ' ' + start.y + 'C' + cp[0].x + ' ' + cp[0].y + ' ' + cp[1].x + ' ' + cp[1].y + ' ' + end.x + ' ' + end.y)
            .attr(this._attr)
            .toBack();

        this._set.push(this._path);
	},

    getControlPoints: function(start, end) {
        var cp1 = { x: 0, y: 0 };
        var cp2 = { x: 0, y: 0 };
        var deltax = (end.x - start.x) / 2;
        var deltay = (start.y - end.y) / 2;

        if (start.y > end.y) {
            cp1 = { x: start.x, y: start.y - deltay };
            cp2 = { x: end.x - deltax, y: end.y };
        }
        else {
            cp1 = { x: start.x + deltax, y: start.y };
            cp2 = { x: end.x, y: end.y + deltay };
        }
        return [ cp1, cp2 ];
    }
});