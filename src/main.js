import Vue from 'vue';

import VueMapbox from 'vue-mapbox';
import Mapbox from 'mapbox-gl';

import App from './App.vue';
import router from './router';

Vue.use(VueMapbox, { mapboxgl: Mapbox });
// Vue.use(VueMapbox.plugin, { mapboxgl: window.mapboxgl });

Vue.config.productionTip = false;


new Vue({
  router,
  components: { Mapbox },
  render: h => h(App),
}).$mount('#app');
