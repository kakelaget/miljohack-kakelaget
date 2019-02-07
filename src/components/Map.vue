<template>
	<div>
		<h1>Maaap</h1>
	  <MglMap :accessToken="accessToken" :mapStyle.sync="mapStyle" />
	 </div>
</template>

<script>
import { MglMap } from "vue-mapbox";

export default {
  components: {
    MglMap
  },
  data() {
    return {
      accessToken: "pk.eyJ1Ijoia2FzcGVycnQiLCJhIjoiY2pydWVyaHl1MDN6djQ0bDVuc3ZseDIzeCJ9.1r8QxHcJboxo3PJArWKOYQ", // your access token. Needed if you using Mapbox maps
	    mapStyle: "mapbox://styles/kasperrt/cjrufjc6x0gbo1fp36xs6hamh",
	  }
  }
};
</script>