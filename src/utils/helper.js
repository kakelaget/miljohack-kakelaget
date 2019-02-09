
function geoToCords(geoJSON) {
	return geoJSON.features[0].geometry.coordinates;
}

function sortProperty(a,b) {
	if (a.title < b.title)
		return -1;
	if (a.title > b.title)
		return 1;
	return 0;
}

function compare(arr1,arr2){
	if(!arr1  || !arr2) return

	let result;

	arr1.forEach((e1,i) => arr2.forEach(e2 => {
		if (e1.length > 1 && e2.length) {
			result = compare(e1,e2);
		} else if (e1 !== e2 ) {
			result = false
		} else {
			result = true
		}
	}))

	return result
}

export { geoToCords, compare, sortProperty }
