<template>
    <div class="sub-title">
        <li v-for="(route, i) in filterElement.cars" class="filter-checkbox sub">
            <input type="checkbox" :name="i + route.title" :id="i + route.title"  @change=" route.show = !route.show " v-on:click="removeHideRoute(route, !route.show, route.id, route.car)" />
            <label :for="i + route.title" v-bind:class="{ checked : route.show }">{{ route.title + " (rute " + route.id + ")" }}</label>
        </li>
    </div>
</template>

<script>
import store from '@/utils/store.js';
import { newCarLayer } from '@/utils/mapBox.js'

    export default {
        props: {
            filterElement: {
                type: Object,
                required: true
            }
        },
        methods: {
            removeHideRoute(route, show, id, car) {
                console.log(show, id, car);
                if (!show) {
                    store.getters.map.removeLayer(id);
                    store.getters.map.removeSource(id);
                } else {
                    newCarLayer(car);
                }
                route.show = show;
            }
        },
        computed: {
            filterCarElements: function(cats) {
                return this.filterElements.find(x => x.title == cats);
            },
          filterElements: function() {
              return store.getters.filterElements;
          },
          map: function() {
              return store.getters.map;
          },
          filter: function() {
              return store.getters.filter;
          },
          carCategories: function() {
              return store.getters.carCategories;
          }
        },
    }
</script>

<style>
.sub-title {
    width: 100%;
    align-self: flex-start;
}
.filter-checkbox.sub {
    width: 100%;
    align-items: flex-end;
    display: flex;
    text-align: center;
}
</style>
