import store from './store.js'
import { idOfCar, carToGeoJSON } from './geobus.js'

function newCarLayer(car) {
	const map = store.getters.map;
  const carID = idOfCar(car);

  map.addSource(carID, {
    type: 'geojson',
    data: carToGeoJSON(car)
  })

  map.addLayer({
    'id': carID,
    'type': 'symbol',
    'source': carID,
    'layout': {
      'icon-allow-overlap': true,
      'icon-image': '{icon}',
      "icon-size": 0.7,
      'text-field': '{title}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
    }
  })
}

export { newCarLayer }