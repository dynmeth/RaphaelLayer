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