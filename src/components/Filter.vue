<template>
    <div class="filter-container">
        <h4>Filtrer visning av ruter</h4>
        <ul>
            <li v-for="(route, i) in filterElements" class="filter-checkbox">
                <input type="checkbox" :name="i" :id="i"  @change=" route.show = !route.show " v-on:click="removeHideRoute(!route.show, route.id)" />
                <label :for="i" v-bind:class="{ checked : route.show }">{{ route.title + " (rute " + route.id + ")" }}</label>
            </li>
        </ul>
    </div>
</template>

<script>

    import store from '@/utils/store.js';

    export default {
        methods: {
            removeHideRoute(show, id) {
                var visibility = store.getters.map.getLayoutProperty(id, 'visibility')
                if (visibility === 'visible' && !show) {
                    store.getters.map.setLayoutProperty(id, 'visibility', 'none');
                } else {
                    store.getters.map.setLayoutProperty(id, 'visibility', 'visible');
                }
            }
        },
        computed: {
          filterElements: function() {
              return store.getters.filterElements;
          },
          map: function() {
              return store.getters.map;
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

    .filter-container h4 {
        background: #e0e0e0;
        padding: 30px;
        border-bottom: 1px solid lightgrey;
        margin: 0;
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
    }

    .filter-checkbox label {
        color: black;
        display: block;
        height: 20px;
        padding: 30px 30px 30px 33px;
        cursor: pointer;
        width: 100%;
    }

    .filter-checkbox label.checked {
        padding-left: 30px;
    }

    .filter-container:nth-child(odd) {
        background: transparent;
    }
</style>
