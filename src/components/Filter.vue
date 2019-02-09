<template>
    <div class="filter-container">
        <h3>Filtrer visning av ruter</h3>
        <ul>
            <li class="filter-checkbox" v-bind:class="{ hide : filterElements.length <= 0}">
                <input type="checkbox" name="alleRuter" id="alleRuter"  @change="showHideAllRoutes()" />
                <label for="alleRuter" v-bind:class="{ checked : filter }">Vis alle ruter</label>
            </li>
            <li class="filter-checkbox header" v-bind:class="{ hide : filterElements.length > 0}">
                <h4>Laster inn . . .</h4>
            </li>
            <li v-for="filterElement in filterElements" class="filter-checkbox">
                <div class="master-title">
                    <input type="checkbox" :name="filterElement.title" :id="filterElement.title"  v-on:click="removeHideCategory(filterElement.title)" />
                    <label :for="filterElement.title" v-bind:class="{ checked : filterElement.show }">{{filterElement.title}}</label>
                </div>
                <Subfilter :filterElement="filterElement"></Subfilter>
            </li>
        </ul>
    </div>
</template>

<script>

    import store from '@/utils/store.js';
    import Subfilter from '@/components/Subfilter.vue';
    import { newCarLayer } from '@/utils/mapBox.js'

    export default {
        components: {
            Subfilter
        },
        methods: {
            removeHideCategory(title) {
                console.log(title);
                for(var i = 0; i< this.filterElements.length; i++) {
                    if(this.filterElements[i].title == title) {
                        this.filterElements[i].show = !this.filterElements[i].show;
                        for(var y = 0; y < this.filterElements[i].cars.length; y++) {
                            console.log(this.filterElements[i].show)
                            this.filterElements[i].cars[y].show = this.filterElements[i].show;
                            console.log(this.filterElements[i].cars[y]);
                            var id = this.filterElements[i].cars[y].id;
                            var car = this.filterElements[i].cars[y].car;
                            if (!this.filterElements[i].cars[y].show) {
                                store.getters.map.removeLayer(id);
                                store.getters.map.removeSource(id);
                            } else {
                                newCarLayer(car);
                            }
                        }
                        return;
                    }
                }
                store.dispatch("setFilterElements", this.filterElements);
            },
            showHideAllRoutes() {
                store.dispatch("setFilter", !this.filter);
                console.log(this.filterElements);
                for(var i = 0; i < this.filterElements.length; i++) {
                    this.filterElements[i].show = this.filter;
                    for(var y = 0; y < this.filterElements[i].cars.length; y++) {
                        console.log("qq");
                        this.removeHideRoute(this.filter, this.filterElements[i].cars[y].id, this.filterElements[i].cars[y].car);
                        this.filterElements[i].cars[y].show = this.filter;
                    }
                }
            },
            removeHideRoute(show, id, car) {
                if (!show) {
                    store.getters.map.removeLayer(id);
                    store.getters.map.removeSource(id);
                } else {
                    newCarLayer(car);
                }
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
        data() {
            return {

            }
        }
    }
</script>

<style>

    input[type="checkbox"] {
        display: none;
    }

    .filter-container h3, .filter-container h4 {
        background: #e0e0e0;
        padding: 30px;
        border-bottom: 1px solid lightgrey;
        margin: 0;
    }

    .master-title {
        align-self: flex-start;
    }

    .filter-container h4 {
        width: 100%;
        cursor: default;
        color: black;
    }

    .filter-checkbox label::before {
        height: 15px;
        width: 15px;
        color: white;
        border: 1px solid grey;
        display: inline-block;
        margin-right: 5px;
        content: "";
    }

    .filter-checkbox label.checked::before {
        background: #DA291C;
        content: "\2713";
        height: 12px;
        width: 15px;
        padding: 0 0 7px 3px;
    }

    .filter-container li.filter-checkbox {
        display: flex;
        flex-direction: row;
        padding: 0px;
        height: auto;
        align-items: center;
        flex-direction: column;
    }

    .filter-checkbox label {
        color: black;
        display: block;
        height: 20px;
        padding: 30px 30px 30px 33px;
        cursor: pointer;
        width: 100%;
    }

    .filter-checkbox.header {
        text-align: center;
    }

    .hide {
        display: none !important;
    }

    .filter-checkbox label.checked {
        padding-left: 30px;
    }

    .filter-container:nth-child(odd) {
        background: transparent;
    }
</style>
