(function() {
	var map = new L.Map('map');
	var tiles = new L.TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '',
	    maxZoom: 18
	});

	var adelaide = new L.LatLng(-34.93027490891421, 138.603875041008);

	map.setView(adelaide, 13).addLayer(tiles);
	map.addLayer(new R.Marker(adelaide));

	map.on('click', function(e) {
		map.addLayer(new R.Bezier([adelaide, e.latlng], {'stroke': '#f00', 'stroke-width': 3}));
		console.log(e.latlng);
		map.addLayer(new R.Pulse(e.latlng, {'stroke': '#2478ad', 'fill': '#30a3ec'}, {'stroke': '#30a3ec', 'stroke-width': 3}));
	});
})();