<template>
  <div>
  	<h1>Maaap</h1>
	  <mapbox :access-token="accessToken" :map-options="options">
  </mapbox>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';

export default {
  components: {
     'mapbox': Mapbox
  },
  data() {
  	return {
  		accessToken: "pk.eyJ1Ijoia2FzcGVycnQiLCJhIjoiY2pydWVyaHl1MDN6djQ0bDVuc3ZseDIzeCJ9.1r8QxHcJboxo3PJArWKOYQ",
  		options: {
	      style: 'mapbox://styles/kasperrt/cjrufjc6x0gbo1fp36xs6hamh',
  	    center: [10.7601723, 59.9167327],
    	  zoom: 16,
    	}
  	}
  }
}
</script>

<style>
	#map {
		width: 100%;
		height: 80vh;
		position: absolute;
		margin:0;
		z-index:1;
	}
</style>
