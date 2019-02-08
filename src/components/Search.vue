<template>
    <div class="search-element">
        <form @submit.prevent="processSearch">
            <div class="container-search">
                <input type="text" placeholder="Søk etter buss" class="input-field" v-model="searchText" />
                <input type="submit" value="Søk" class="input-submit" />
            </div>
        </form>
        <button class="read-button"
            v-on:click=" readAllowed = !readAllowed ">Assistert opplesning</button>
        <div class="search-result">
            <div v-bind:class="{ hide : searchResults.length > 0 }">
                Ingen resultater . . .
            </div>
            <div v-bind:class="{ hide : !fetchLocale }">
                Holdeplasser nær deg . . .
            </div>
            <div class="search-result-stops"
                v-for="searchResult in searchResults"
                v-bind:class="{ hide : searchResults.length == 0}"
                v-on:click="goToCord(searchResult.id, searchResult.coordinates)">
                {{searchResult.title}}
            </div>
            <hr />
            <div v-for="departure in departures"
                v-bind:class="{ hide : departures.length == 0}">
                <div v-bind:style="{ color: '#' + departure.color }"
                    v-on:click="goToCurrentCordsofBus(departure.id)">
                    {{ departure.number }} - {{ departure.title }} om {{ departure.in.minutes }} min og {{ departure.in.seconds }} sek.
                </div>
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
        async searchLocation(location) {
            var coordinates = location.coords;
            this.fetchLocale = true;
            this.searchResults = [""];
            const toFeature = await service.getStopPlacesByPosition(coordinates, 600);
            this.searchResults = [];
            for(var i = 0; i < toFeature.length; i++) {
                if(toFeature[i].id.indexOf("NSR:StopPlace") == -1) continue;
                this.searchResults.push({
                    title: toFeature[i].name,
                    coordinates: [
                        toFeature[i].longitude,
                        toFeature[i].latitude,
                    ],
                    id: toFeature[i].id
                });
            }
        },

        async addBikeStops(coords, range) {
            for(var i = 0; i < this.bikeLayers.length; i++) {
                store.getters.map.removeLayer(this.bikeLayers[i]);
                store.getters.map.removeLayer(this.bikeLayers[i].id);
            }
            for(var i = 0; i < this.bikeSources.length; i++) {
                store.getters.map.removeSource(this.bikeSources[i]);
            }
            this.bikeLayers = [];
            this.bikeSources = [];

            const list = await service.getBikeRentalStations(coords, range);

            for(var i = 0; i < list.length; i++) {
                const geoJson = {
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
                };
                geoJson.features[0].properties.title = list[i].id + "_bicycle";
                geoJson.features[0].geometry.coordinates = [list[i].longitude, list[i].latitude];

                store.getters.map.addSource(list[i].id + "_bicycle", {
                    type: 'geojson',
                    data: geoJson
                });
                var newBike = {
                    'id': list[i].id + "_bicycle",
                    'type': 'symbol',
                    'source': list[i].id + "_bicycle",
                    'layout': {
                        'icon-image': 'bicycle-15',
                        'text-field': list[i].bikesAvailable + " ledig av " + list[i].spacesAvailable,
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 0.6],
                        'text-anchor': 'top',
                        'icon-size': 2
                    }
                };

                store.getters.map.addLayer(newBike);

                this.bikeSources.push(list[i].id + "_bicycle");
                this.bikeLayers.push(newBike)
            }
        },
        goToCurrentCordsofBus(id) {
            var fullId = id;
            var smallId = id.split("RUT:Line:")[1];
            console.log(fullId, smallId);
        },
        async processSearch() {
            this.searchResults = [];
            this.fetchLocale = false;
            const toFeature = await service.getFeatures(this.searchText);
            for(var i = 0; i < toFeature.length; i++) {
                if(toFeature[i].properties.id.indexOf("NSR:StopPlace") == -1) continue;
                this.searchResults.push({
                    title: toFeature[i].properties.name,
                    coordinates: toFeature[i].geometry.coordinates,
                    id: toFeature[i].properties.id
                });
            }

        },

        endedTalking() {
            if(this.talkQueue.length > 0) {
                window.responsiveVoice.speak(this.talkQueue[0], {onend: this.endedTalking});
                this.talkQueue.shift();
            } else {
                this.talking = false;
            }
        },

        speak(text) {
            if(this.speakAllowed) {
                window.responsiveVoice.speak(text, "Norwegian Female", {onend: this.endedTalking});
            }
        },

        timeoutFunction() {
            var now = new Date();

            if(this.queueChecklist.length > 0) {
                var difference = (this.queueChecklist[0].time.getTime() - now.getTime()) / 1000;
                if(difference > -1 && difference < 5) {
                    console.log(this.queueChecklist[0].title);
                    if(!this.talking) {
                        this.talking = true;
                        this.speak("Nå kommer buss " + this.queueChecklist[0].title);
                        this.queueChecklist.shift();
                    } else {
                        this.talkQueue.push("Nå kommer buss " + this.queueChecklist[0].title + " om " + 60 + " sekunder.");
                    }
                } else if(difference <= -1) {
                    this.queueChecklist.shift();
                } else if(Math.floor(difference) == 60) {
                    if(!this.talking) {
                        this.talking = true;
                        this.speak("Nå kommer buss " + this.queueChecklist[0].title + " om " + 60 + " sekunder.");
                    } else {
                        this.talkQueue.push("Nå kommer buss " + this.queueChecklist[0].title + " om " + 60 + " sekunder.");
                    }
                } else if(Math.floor(difference) == 120) {
                    if(!this.talking) {
                        this.talking = true;
                        this.speak("Nå kommer buss " + this.queueChecklist[0].title + " om " + 2 + " minutter.");
                    } else {
                        this.talkQueue.push("Nå kommer buss " + this.queueChecklist[0].title + " om " + 60 + " sekunder.");
                    }
                }
            }
            this.queueTimeout = setTimeout(this.timeoutFunction, 1000);
        },

        async goToCord(id, coordinates) {
            this.departures = [];
            clearTimeout(this.queueTimeout);
            store.getters.map.flyTo({
                center: [
                    coordinates[0],
                    coordinates[1]
                ],
                zoom: 16
            });

            const _departures = await service.getStopPlaceDepartures(id, {
                timeRange: 3600
            });

            if(this.marker != undefined) this.marker.remove();

            this.marker = new mapboxgl.Marker()
                .setLngLat(coordinates)
                .addTo(store.getters.map);

            this.queueChecklist = [];
            this.queueTimeout = setTimeout(this.timeoutFunction, 1000);

            var now = new Date();
            for(var i = 0; i < _departures.length; i++) {
                //if(_departures[i].serviceJourney.journeyPattern.line.id.indexOf("RUT:Line:") == -1) continue;
                var arrival = new Date(_departures[i].expectedDepartureTime);
                var seconds = Math.abs((arrival.getTime() - now.getTime()) / (1000));
                var minutes = Math.floor(seconds /  60);
                seconds = Math.floor(seconds - (minutes * 60));

                this.queueChecklist.push({
                    title: _departures[i].serviceJourney.journeyPattern.line.name,
                    time: new Date(_departures[i].expectedDepartureTime),
                    id: _departures[i].serviceJourney.journeyPattern.line.id
                });
                this.departures.push({
                    id: _departures[i].serviceJourney.journeyPattern.line.id,
                    number: _departures[i].serviceJourney.journeyPattern.line.id.indexOf("RUT:Line:") == -1 ?
                        _departures[i].serviceJourney.journeyPattern.line.id :
                        _departures[i].serviceJourney.journeyPattern.line.id.split("RUT:Line:")[1],
                    title: _departures[i].serviceJourney.journeyPattern.line.name,
                    in: {
                        minutes: minutes,
                        seconds: seconds
                    },
                    color: _departures[i].serviceJourney.journeyPattern.line.presentation.colour,
                });
            }
            this.addBikeStops({
                longitude: coordinates[0],
                latitude: coordinates[1]
            }, 500);
        }
    },
    mounted(){
        this.$root.$on('fetchAndSearchLocaleRoute', (data) => {
            this.searchLocation(data);
        });
    },
    data(){
        return {
            queueTimeout: null,
            queueChecklist: [],
            searchText: "",
            searchResults: [],
            departures: [],
            fetchLocale: false,
            bikeSources: [],
            bikeLayers: [],
            marker: null,
            talking: false,
            talkQueue: [],
            readAllowed: false,
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
    cursor: pointer;
}

.input-submit:hover {
    background: darkgrey;
    color: whitesmoke;
    border: 1px solid whitesmoke;
}

.search-result {
    padding: 20px 0;
    overflow: auto;
    height: 100%;
    flex: 1;
}

.read-button {
    height: 50px;
    background: darkgrey;
    font-size: 1rem;
    font-weight: lighter;
    width: 90%;
    position: relative;
    /* display: flex; */
    left: 0;
    right: 0;
    margin: auto;
    border: 1px solid whitesmoke;
    cursor: pointer;
    color: whitesmoke;
}

.read-button:hover {
    color: darkgrey;
    background-color: whitesmoke;
    border: 1px solid darkgrey;
}

.search-result div{
    padding:10px;
    cursor: pointer;
}

.search-result div:hover{
    background: lightgrey;
}

.search-result hr {
    width: 50%;
}

</style>
