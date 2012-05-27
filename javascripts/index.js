(function() {
	var map = new L.Map('map');
	var tiles = new L.TileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	    maxZoom: 18
	});

	var adelaide = new L.LatLng(-34.93027490891421, 138.603875041008);

	map.setView(adelaide, 13).addLayer(tiles);

	map.addLayer(new R.Marker(adelaide));

	map.on('click', function(e) {
		var b = new R.BezierAnim([adelaide, e.latlng], {}, function() {
			var p = new R.Pulse(
					e.latlng, 
					6,
					{'stroke': '#2478ad', 'fill': '#30a3ec'}, 
					{'stroke': '#30a3ec', 'stroke-width': 3});

			map.addLayer(p);
			setTimeout(function() {
				map.removeLayer(b).removeLayer(p);
			}, 3000);
		});

		map.addLayer(b);
	});
})();