<template>
  <div>
	  <mapbox 
	  	:access-token="accessToken" 
	  	:map-options="options"
	  	@map-click="mapClicked"
	  	@geolocate-geolocate="geolocate"
	  	@map-load="mapLoaded"></mapbox>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import axios from 'axios';
import { getCordsByLineNumber, getGeoJSONByLineNumber } from '@/utils/geobus.js'
import { geoToCords } from '@/utils/helper.js'

export default {
  components: {
     'mapbox': Mapbox
  },
  data() {
  	return {
  		accessToken: "pk.eyJ1Ijoia2FzcGVycnQiLCJhIjoiY2pydWVyaHl1MDN6djQ0bDVuc3ZseDIzeCJ9.1r8QxHcJboxo3PJArWKOYQ",
  		options: {
	      style: 'mapbox://styles/kasperrt/cjrufjc6x0gbo1fp36xs6hamh',
		    center: [10.7628952, 59.9162614],
	  	  zoom: 10,
	  	}
  	}
  },
  beforeMount() {
  },
  methods: {
  	mapClicked(map, e) {
      alert('Map Clicked!');
    },
  	geolocate(control, position) {
      console.log(`User position: ${position.coords.latitude}, ${position.coords.longitude}`);
    },
    async mapLoaded(map) {
    	this.map = map;
    	this.map.addSource('bus-17', { 
		  	type: 'geojson', 
		  	data: await getGeoJSONByLineNumber('17')
		  })

		  this.map.addLayer({
		  	'id': 'bus-17',
		  	'type': 'symbol',
		  	'source': 'bus-17',
		  	'layout': {
	        'icon-image': '{icon}-15',
	        'text-field': '{title}',
	        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
	        'text-offset': [0, 0.6],
	        'text-anchor': 'top'
	      }
		  })

		  window.setInterval(() => {
		  	getGeoJSONByLineNumber('17')
		  		.then((resp) => {
		  			this.map.getSource('bus-17').setData(resp);
		  			this.map.flyTo({
		  				center: geoToCords(resp),
		  				zoom: 14
		  			})
		  		})
		  }, 3000);
    },
  }
}
</script>

<style>
	#map {
		width: 100%;
		height: 90vh;
		position: absolute;
		margin:0;
		z-index:1;
	}
</style>
