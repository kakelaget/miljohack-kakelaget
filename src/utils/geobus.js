import axios from 'axios';

const BASE_URL = 'http://localhost:3000'

function getCordsByLineNumber(lineNumber) {

	return axios.get(BASE_URL + '/geotest', { 
		params: {
			lineRef: `RUT:Line:${lineNumber}`
		}
	})
	.then((resp) => resp.data.data.MonitoredVehicleJourney[0].VehicleLocation[0])
	.then((VehicleCords) => { return { long: VehicleCords.Longitude[0], lat: VehicleCords.Latitude[0] } })
}

function getGeoJSONByLineNumber(lineNumber) {
	const GEO_JSON_MOCK = {
		"type": "FeatureCollection",
    "features": [{
    	"type": "Feature",
      'properties': {
        'title': 'Bus 17',
        'icon': 'bus'
      },
      "geometry": {
      	"type": "Point",
        "coordinates": [ undefined,	undefined ]
      }
    }]
	}

	return getCordsByLineNumber(lineNumber)
		.then((cords) => {
			let geoJSONPosition = GEO_JSON_MOCK;
			geoJSONPosition.features[0].geometry.coordinates = [ cords.long, cords.lat ];
			return geoJSONPosition
		})
}

export { getCordsByLineNumber, getGeoJSONByLineNumber }