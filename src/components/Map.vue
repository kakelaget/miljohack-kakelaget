<template>
    <div>
        <mapbox
        :access-token="accessToken"
        :map-options="options"
        @map-click="mapClicked"
        @map-init="mapInitialized"
        :geolocate-control="geolocateControl"
        @geolocate-geolocate="geolocate"
        @map-load="mapLoaded"></mapbox>
    </div>
</template>

<script>

import EnturService from '@entur/sdk';
import Search from '@/components/Search.vue';
import mapboxgl from 'mapbox-gl';
import store from '@/utils/store.js';
import Mapbox from 'mapbox-gl-vue';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import axios from 'axios';
import { getCarByLine, carToGeoJSON, idOfCar, cordsOfCar, titleOfCar, routeGeoJson} from '@/utils/geobus.js'
const service = new EnturService({ clientName: 'miljohack-ruterentur' })
import { geoToCords, compare, sortProperty} from '@/utils/helper.js'
import { newCarLayer } from '@/utils/mapBox.js'
import socketData from '@/utils/websockets.js';

var MapboxDraw = require('@mapbox/mapbox-gl-draw');

export default {
    components: {
        Mapbox,
        MapboxTraffic
    },
    data() {
        return {
            accessToken: "pk.eyJ1Ijoia2V2aW5taWRib2UiLCJhIjoiY2pydWhlamQyMHJ2NTRhdGN1em5ndXVyMyJ9.Ejdo_3iuuGOD662Bh6es4w",
            options: {
                style: 'mapbox://styles/kevinmidboe/cjrvwyoft1tij1ftb94f75lqs',
                sprite: 'mapbox://styles/kevinmidboe/cjrvwyoft1tij1ftb94f75lqs',
                center: [10.7601723, 59.9167327],
                zoom: 12,
                minZoom: 0,
                maxZoom: 18
            },
            loadedCars: [],
            draw: undefined,
            selectedRoutes: [12, 13, 19, 18, 30, 32],
            geolocateControl: {
                show: true, position: 'bottom-left', options: {}
            },
            loadedCars: [],
            draw: undefined,
        }
    },
    computed: {
        map: function() {
            return store.getters.map;
        },
        filterElements: function() {
            return store.getters.filterElements;
        },
        filter: function() {
            return store.getters.filter;
        },
        carCategories: function () {
            return store.getters.carCategories;
        }
    },
    beforeMount() {
        setTimeout(() => {
            window.setInterval(async () => {
                this.updateRoutes(this.selectedRoutes)
            }, 3000);
        }, 4000)
    },
    methods: {
        mapClicked(map, e) {
            // alert('Map Clicked!');
        },
        geolocate(control, position) {
            console.log(`User position: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        mapInitialized: function(map) {
            store.dispatch("setMap", map);
            this.draw = new MapboxDraw({
                'displayControlsDefault': false,
            })

            map.addControl(this.draw, 'top-left')

            map.addControl(new MapboxTraffic({
                // showTraffic: true
            }));

            map.addControl(new MapboxStyleSwitcherControl(
                [{
                    title: "Natt",
                    uri:"mapbox://styles/kasperrt/cjruk4dqr0kl31foaivs6eml9"
                },
                {
                    title: "Dag",
                    uri:"mapbox://styles/kevinmidboe/cjrvwyoft1tij1ftb94f75lqs"
                }]
            ));
        },
        mapLoaded(map) {
            this.layerRoutes(this.selectedRoutes)
        },
        layerRoutes(routes) {
            routes.map((route) => {
                getCarByLine(route)
                .then((cars) => {

                    cars.map((car) => {
                        const carID = idOfCar(car);
                        if (carID in this.loadedCars) return;


                        if(this.filter) {
                            newCarLayer(car);
                        }

                        this.loadedCars = {
                            ...this.loadedCars,
                            [carID]: car
                        };
                        var filterElementToPush = {
                            show: this.filter,
                            title: titleOfCar(car),
                            id: carID,
                            car: car
                        };
                        if(this.filterElements.find(x => x.title == titleOfCar(car)) == undefined) {
                            this.filterElements.push({
                                title: titleOfCar(car),
                                cars: [],
                                show: true,
                            });
                        }
                        console.log("adding new car");
                        for(var i = 0; i < this.filterElements.length; i++) {
                            console.log("checking");
                            if(this.filterElements[i].title == titleOfCar(car)) {
                                console.log("pushed", filterElementToPush);
                                this.filterElements[i].cars.push(filterElementToPush);
                                break;
                            }
                        }

                    })
                })
            })
        },
        updateRoutes(routes) {
            const bounds = this.map.getBounds();
            const _latestSocketData = socketData({
                lat: bounds._sw.lat,
                long: bounds._sw.lng,
            },{
                lat: bounds._ne.lat,
                long: bounds._ne.lng,
            });
            console.log(_latestSocketData);
            _latestSocketData.map((latestSocketData) => {
                if (latestSocketData !== undefined) {
                    const vehicleId = latestSocketData.vehicle_id
                    const car = {
                        coords: [latestSocketData.lng, latestSocketData.lat],
                        id: vehicleId
                    };
                    const geoJson = routeGeoJson(car);

                    if(this.loadedCars[vehicleId] != undefined) {
                        /*var element = this.filterElement.find(x => x.id == vehicleId);
                        if(element != undefined) element.car = car;*/
                        if(this.loadedCars[vehicleId] == car) return;
                        this.map.getSource(vehicleId).setData(geoJson);
                        this.loadedCars[vehicleId] = car;

                        console.log("qqqq");
                    } else {
                        this.map.addSource(vehicleId, {
                            type: 'geojson',
                            data: geoJson
                        })

                        this.map.addLayer({
                            'id': vehicleId,
                            'type': 'symbol',
                            'source': vehicleId,
                            'layout': {
                                'icon-allow-overlap': true,
                                'icon-image': '{icon}',
                                "icon-size": 0.7,
                                'text-field': '{title}',
                                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                                'text-offset': [0, 0.6],
                                'text-anchor': 'top'
                            }
                        });
                        this.loadedCars[vehicleId] = car;
                        /*var filterElementToPush = {
                            show: this.filter,
                            title: titleOfCar(car),
                            id: carID,
                            car: car
                        }
                        this.filterElements.push(filterElementToPush);*/
                        this.draw.add(layer);
                    }

                }})

                routes.map((route) => {
                    getCarByLine(route)
                    .then((cars) => {

                        cars.map((car) => {
                            const carID = idOfCar(car);
                            const carCords = cordsOfCar(car);

                            if (this.loadedCars[carID] === undefined) {
                                console.log('THIS CAR WAS NOT REG')
                                return
                            }


                            if (! this.loadedCars[carID]) { return }
                            var _break = false;
                            var filterElement = {show: false};
                            var filterParent = {show:false};
                            for(var i = 0; i < this.filterElements.length; i++) {
                                if(this.filterElements[i].title == titleOfCar(car)) {
                                    filterParent = this.filterElements[i];
                                    var filterElement = this.filterElements[i].cars.find(x => x.id == carID);
                                    filterElement.car = car;
                                    _break = true;
                                    break;
                                }
                                if(_break) break;
                            }
                            const oldCarCords = cordsOfCar(this.loadedCars[carID])

                            if (!compare(carCords, oldCarCords)) {
                                if(filterElement.show && filterParent.show) {
                                    try {
                                        this.map.getSource(carID).setData(carToGeoJSON(car));

                                        var feature = {
                                            type: 'Feature',
                                            properties: {},
                                            geometry: {
                                                type: 'LineString',
                                                coordinates: [
                                                    !oldCarCords ? carCords : oldCarCords,
                                                    carCords
                                                ]
                                            }
                                        };
                                    } catch(e) {
                                        newCarLayer(car);
                                    }
                                    this.draw.add(feature);
                                }

                                // this.map.flyTo({
                                //   center: carCords,
                                //   zoom: 16
                                // })
                            }
                            if(!filterElement.show || !filterParent.show) {
                                try {
                                    this.map.removeLayer(car);
                                    this.map.removeLayer(carID);
                                    this.map.removeSource(carID);
                                } catch(e) {
                                    console.log("tried to remove and crashed");
                                }
                            }

                            this.loadedCars = {
                                ...this.loadedCars,
                                [carID]: car
                            };
                        })
                    })
                })
            },
        }
    }
    </script>

    <style>

    #map {
        width: 70vw;
        height: 100vh;
        margin:0;
        z-index:1;
    }

    .mapboxgl-ctrl-traffic {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23333333%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%20viewBox%3D%22-2%20-2%2022%2022%22%3E%0D%0A%3Cpath%20d%3D%22M13%2C4.1L12%2C3H6L5%2C4.1l-2%2C9.8L4%2C15h10l1-1.1L13%2C4.1z%20M10%2C13H8v-3h2V13z%20M10%2C8H8V5h2V8z%22%2F%3E%0D%0A%3C%2Fsvg%3E');
    }

    .mapboxgl-ctrl-map {
        background-image: url('data:image/svg+xml;charset=utf8,<svg%20xmlns="http://www.w3.org/2000/svg"%20fill="#333333%22%20viewBox=%22-10%20-10%2060%2060%22%20preserveAspectRatio=%22xMidYMid%20meet%22%3E%3Cg%3E%3Cpath%20d=%22m25%2031.640000000000004v-19.766666666666673l-10-3.511666666666663v19.766666666666666z%20m9.140000000000008-26.640000000000004q0.8599999999999923%200%200.8599999999999923%200.8600000000000003v25.156666666666666q0%200.625-0.625%200.783333333333335l-9.375%203.1999999999999993-10-3.5133333333333354-8.906666666666668%203.4383333333333326-0.2333333333333334%200.07833333333333314q-0.8616666666666664%200-0.8616666666666664-0.8599999999999994v-25.156666666666663q0-0.625%200.6233333333333331-0.7833333333333332l9.378333333333334-3.198333333333334%2010%203.5133333333333336%208.905000000000001-3.4383333333333344z%22%3E%3C/path%3E%3C/g%3E%3C/svg%3E');
    }

    .mapboxgl-style-list
    {
        display: none;
    }

    .mapboxgl-style-list button
    {
        background: none;
        border: none;
        cursor: pointer;
        display: block;
        font-size: 14px;
        padding: 8px 8px 6px;
        text-align: right;
        width: 100%;
    }

    .mapboxgl-style-list button.active
    {
        font-weight: bold;
    }

    .mapboxgl-style-list button:hover
    {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .mapboxgl-style-list button + button
    {
        border-top: 1px solid #ddd;
    }

    .mapboxgl-style-switcher
    {
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iNTQuODQ5cHgiIGhlaWdodD0iNTQuODQ5cHgiIHZpZXdCb3g9IjAgMCA1NC44NDkgNTQuODQ5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NC44NDkgNTQuODQ5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PGc+PGc+PHBhdGggZD0iTTU0LjQ5NywzOS42MTRsLTEwLjM2My00LjQ5bC0xNC45MTcsNS45NjhjLTAuNTM3LDAuMjE0LTEuMTY1LDAuMzE5LTEuNzkzLDAuMzE5Yy0wLjYyNywwLTEuMjU0LTAuMTA0LTEuNzktMC4zMThsLTE0LjkyMS01Ljk2OEwwLjM1MSwzOS42MTRjLTAuNDcyLDAuMjAzLTAuNDY3LDAuNTI0LDAuMDEsMC43MTZMMjYuNTYsNTAuODFjMC40NzcsMC4xOTEsMS4yNTEsMC4xOTEsMS43MjksMEw1NC40ODgsNDAuMzNDNTQuOTY0LDQwLjEzOSw1NC45NjksMzkuODE3LDU0LjQ5NywzOS42MTR6Ii8+PHBhdGggZD0iTTU0LjQ5NywyNy41MTJsLTEwLjM2NC00LjQ5MWwtMTQuOTE2LDUuOTY2Yy0wLjUzNiwwLjIxNS0xLjE2NSwwLjMyMS0xLjc5MiwwLjMyMWMtMC42MjgsMC0xLjI1Ni0wLjEwNi0xLjc5My0wLjMyMWwtMTQuOTE4LTUuOTY2TDAuMzUxLDI3LjUxMmMtMC40NzIsMC4yMDMtMC40NjcsMC41MjMsMC4wMSwwLjcxNkwyNi41NiwzOC43MDZjMC40NzcsMC4xOSwxLjI1MSwwLjE5LDEuNzI5LDBsMjYuMTk5LTEwLjQ3OUM1NC45NjQsMjguMDM2LDU0Ljk2OSwyNy43MTYsNTQuNDk3LDI3LjUxMnoiLz48cGF0aCBkPSJNMC4zNjEsMTYuMTI1bDEzLjY2Miw1LjQ2NWwxMi41MzcsNS4wMTVjMC40NzcsMC4xOTEsMS4yNTEsMC4xOTEsMS43MjksMGwxMi41NDEtNS4wMTZsMTMuNjU4LTUuNDYzYzAuNDc3LTAuMTkxLDAuNDgtMC41MTEsMC4wMS0wLjcxNkwyOC4yNzcsNC4wNDhjLTAuNDcxLTAuMjA0LTEuMjM2LTAuMjA0LTEuNzA4LDBMMC4zNTEsMTUuNDFDLTAuMTIxLDE1LjYxNC0wLjExNiwxNS45MzUsMC4zNjEsMTYuMTI1eiIvPjwvZz48L2c+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==);
        background-position: center;
        background-repeat: no-repeat;
        background-size: 70%;
    }

    .mapbox-gl-draw_ctrl-draw-btn {
        display: none !important;
    }

    </style>
