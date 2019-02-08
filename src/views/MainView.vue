<template>
  <div class="home">
      <button
            class="night-switch"
          v-on:click="changeTime()">{{ !dark ? "Natt" : "Dag"}}</button>
    <Map></Map>
    <Nav :dark="this.dark"></Nav>
  </div>
</template>

<script>
import Map from '@/components/Map.vue';
import Nav from '@/components/Nav.vue';

export default {
  name: 'home',
  components: {
    Map,
    Nav,
  },
  created() {
    document.title = "RuterNå";
  },
  methods: {
      changeTime: function() {
          this.dark = !this.dark;
      },
      mapInit: function(map) {
          console.log(map);
      },
      mapInitialized(map) {
        console.log("test");
      }
  },
  data(){
      return {
          dark: false
      }
  }
};
</script>

<style>
    .night-switch {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 9;
        padding: 9px;
        font-size: 1rem;
        background-color: black;
        color: white;
    }
	.home {
		display: flex;
        flex-direction: row;
	}
</style>
