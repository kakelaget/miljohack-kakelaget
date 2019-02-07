<template>
  <div class="home">
    <Map></Map>
    <Nav></Nav>
  </div>
</template>

<script>
import Map from '@/components/Map.vue';
import Nav from '@/components/Nav.vue';

console.log(Map);
export default {
  name: 'home',
  components: {
    Map,
    Nav,
  },
  methods: {
      mapInit: function(map) {
          console.log(map);
      },
      mapInitialized(map) {
        console.log("test");
      }
  },
};
</script>

<style>
	.home {
		display: flex;
        flex-direction: row;
	}
</style>
