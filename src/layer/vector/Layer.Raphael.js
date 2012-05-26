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