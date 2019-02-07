<template>
    <div class="filter-container">
        <h4>Filtrer visning av busser</h4>
        <ul>
            <li v-for="(route, i) in routes" class="filter-checkbox">
                <input type="checkbox" :name="i" :id="i"  @change=" route.show = !route.show " />
                <label :for="i" v-bind:class="{ checked : route.show }">{{ route.title + " (rute " + route.id + ")" }}</label>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        created: function() {
            this.fetchRoutes();
        },
        methods: {
            fetchRoutes() {
                this.routes = [{
                    title: "Buss 13",
                    show: true,
                    id: "1"
                },
                {
                    title: "Buss 13",
                    show: true,
                    id: "3"
                },
                {
                    title: "Trikk 20",
                    show: true,
                    id: "3"
                },
                {
                    title: "Trikk 20",
                    show: true,
                    id: "72"
                },
                {
                    title: "Trikk 17",
                    show: true,
                    id: "56"
                }];
            }
        },
        data() {
            return {
                routes: []
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
        background: #f44336;
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
