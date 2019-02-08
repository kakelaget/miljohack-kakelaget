import axios from 'axios';

const BASE_URL = process.env.VUE_APP_MH_BACKEND || `https://mhgeobus.sklirg.io`
const CAR_TYPES = {
	'Sporvognsdrift': 'Trikk',
	'Nobina': 'Buss'

}

function getCordsByLineNumber(lineNumber) {

	return axios.get(BASE_URL + '/geotest', {
		params: {
			lineRef: `RUT:Line:${lineNumber}`
		}
	})
	// .then((resp) => resp.data.data.)
	.then((VehicleCords) => { return { long: VehicleCords.Longitude[0], lat: VehicleCords.Latitude[0] } })
}

function cordsOfCar(car) {
	if (car === undefined) { return false }

	const VehicleCords = car.MonitoredVehicleJourney[0].VehicleLocation[0];
	return [ parseFloat(VehicleCords.Longitude[0]), parseFloat(VehicleCords.Latitude[0]) ]
	// return { long: VehicleCords.Longitude[0], lat: VehicleCords.Latitude[0] }
}

function nameOfCar(car) {
	return car.MonitoredVehicleJourney[0].PublishedLineName;
}

function typeOfCar(car) {
	return CAR_TYPES[car.MonitoredVehicleJourney[0].OperatorRef[0]]
}

function idOfCar(car) {
	return car.MonitoredVehicleJourney[0].VehicleRef[0];
}

function titleOfCar(car) {
	return `${typeOfCar(car)} ${nameOfCar(car)}`
}

function routeGeoJson(car) {
	const MOCK_GEO_JSON = {
		"type": "FeatureCollection",
	    "features": [{
	    	"type": "Feature",
	      'properties': {
	        'title': car.id,
	        "description": "<strong>Make it Mount Pleasant</strong><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
	        'icon': 'Buss',
	      },
	      "geometry": {
	      	"type": "Point",
	        "coordinates": car.coords
	      }
	    }]
	};
	return MOCK_GEO_JSON;
}

function carToGeoJSON(car) {
	const MOCK_GEO_JSON = {
		"type": "FeatureCollection",
    "features": [{
    	"type": "Feature",
      'properties': {
        'title': '',
        "description": "<strong>Make it Mount Pleasant</strong><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
        'icon': '',
      },
      "geometry": {
      	"type": "Point",
        "coordinates": []
      }
    }]
	}
	const geoJson = MOCK_GEO_JSON;
	geoJson.features[0].properties.title = `${typeOfCar(car)} ${nameOfCar(car)}`
	geoJson.features[0].properties.icon = typeOfCar(car);
	geoJson.features[0].geometry.coordinates = cordsOfCar(car)

	return geoJson
}

function getCarByLine(lineNumber) {
	return axios.get(BASE_URL + '/geopos', {
		params: { lineRef: `RUT:Line:${lineNumber}`}
	})
	.then((response) => response.data.results)
}

export { getCordsByLineNumber, getCarByLine, carToGeoJSON, idOfCar, cordsOfCar, titleOfCar, routeGeoJson }
