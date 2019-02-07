import axios from 'axios';

const BASE_URL = `http://localhost:${process.env.VUE_APP_MH_PORT}`

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
	const VehicleCords = car.MonitoredVehicleJourney[0].VehicleLocation[0];
	return [ parseFloat(VehicleCords.Longitude[0]), parseFloat(VehicleCords.Latitude[0]) ]
	// return { long: VehicleCords.Longitude[0], lat: VehicleCords.Latitude[0] }
}

function nameOfCar(car) {
	return car.MonitoredVehicleJourney[0].PublishedLineName;
}

function typeOfCar(car) {
	return 'Trikk'
}

function idOfCar(car) {
	return car.MonitoredVehicleJourney[0].VehicleRef[0];
}

function carToGeoJSON(car) {
	const MOCK_GEO_JSON = {
		"type": "FeatureCollection",
    "features": [{
    	"type": "Feature",
      'properties': {
        'title': '',
        'icon': 'bus'
      },
      "geometry": {
      	"type": "Point",
        "coordinates": []
      }
    }]
	}
	const geoJson = MOCK_GEO_JSON;
	geoJson.features[0].properties.title = `${typeOfCar(car)} ${nameOfCar(car)}`
	geoJson.features[0].geometry.coordinates = cordsOfCar(car)
	
	return geoJson
}

function getCarByLine(lineNumber) {
	return axios.get(BASE_URL + '/geopos', {
		params: { lineRef: `RUT:Line:${lineNumber}`}
	})
	.then((response) => response.data.results)
}

export { getCordsByLineNumber, getCarByLine, carToGeoJSON, idOfCar, cordsOfCar }