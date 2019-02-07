
function geoToCords(geoJSON) {
	return geoJSON.features[0].geometry.coordinates;
}

export { geoToCords }