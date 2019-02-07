<template>
    <div class="search-element">
        <form @submit.prevent="processSearch">
            <div class="container-search">
                <input type="text" placeholder="Søk etter buss" class="input-field" v-model="searchText" />
                <input type="submit" value="Søk" class="input-submit" />
            </div>
        </form>
        <div class="search-result">
            <div v-bind:class="{ hide : searchResults.length > 0 }">
                Ingen resultater . . .
            </div>
            <div v-for="searchResult in searchResults"
                v-bind:class="{ hide : searchResults.length == 0}"
                v-on:click="goToCord(searchResult.id, searchResult.coordinates)">
                {{searchResult.title}}
            </div>
            <br />
            <div v-for="departure in departures"
                v-bind:class="{ hide : departures.length == 0}">
                {{departure}}
            </div>
        </div>
    </div>
</template>

<script>

import EnturService from '@entur/sdk';
import store from '@/utils/store.js';

const service = new EnturService({ clientName: 'miljohack-ruterentur' })

export default {
    computed: {
      map: function() {
          return store.getters.map;
      }
    },
    methods: {
        async processSearch() {
            this.searchResults = [];

            const toFeature = await service.getFeatures(this.searchText);

            for(var i = 0; i < toFeature.length; i++) {
                this.searchResults.push({
                    title: toFeature[i].properties.name,
                    coordinates: toFeature[i].geometry.coordinates,
                    id: toFeature[i].properties.id
                });
            }

        },
        async goToCord(id, coordinates) {
            this.departures = [];
            store.getters.map.flyTo({
                center: [
                    coordinates[0],
                    coordinates[1]
                ],
                zoom: 19
            });
            const _departures = await service.getStopPlaceDepartures(id, {
                timeRange: 1400
            });

            for(var i = 0; i < _departures.length; i++) {
                this.departures.push(_departures[i].serviceJourney.journeyPattern.line.id);
            }
        }
    },
    data(){
        return {
            searchText: "",
            searchResults: [],
            departures: []
        }
    }
};
</script>

<style>
.container-search {
    padding: 20px 0;
    display: flex;
    justify-content: center;
}
.search-element form {
    flex:0;
}
.search-element {
    max-height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
}
.hide {
    display: none;
}
.input-field {
    background: transparent;
    border: none;
    border-bottom: 1px solid grey;
    padding: 10px;
    margin: 0 20px 0 0px;
    font-size: 1rem;
    width: 60%;
}
.input-submit {
    background: transparent;
    padding: 10px;
    font-size: 1rem;
    color: grey;
    border: 1px solid darkgrey;
}
.search-result {
    padding: 20px;
    overflow: auto;
    height: 100%;
    flex: 1;
}
</style>
