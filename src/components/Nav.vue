<template>
    <div class="nav-container"
        v-bind:class="{ night: dark }">
        <h1 class="nav-header">
            <!--<img src="../assets/ruterna__2.png" alt="RuterNå logo" />-->
            Ruter<span style="font-weight:100">Nå</span>
        </h1>
        <Accordion :accordionItems="accordionComponents"></Accordion>
    </div>
</template>

<script>
    import Accordion from '@/components/Accordion.vue';
    import Search from '@/components/Search.vue';
    import Filter from '@/components/Filter.vue';

    export default {
        name: 'nav-container',
        components: {
            Accordion,
        },
        props: {
            dark: {
                type: Boolean,
                required: false,
            }
        },
        data(){
            return {
                routes: [],
                accordionComponents: [
                    {
                        title: "Søk",
                        Component: Search
                    },
                    {
                        title: "Filtrer",
                        Component: Filter
                    }
                ],
                nightMode: true
            }
        }
    };
</script>

<style>
.nav-container {
    background: #424242;
    max-height: 100vh;
    width: 30vw;
    display: flex;
    flex-direction: column;
}
.night {
    filter: invert(85%);
}
.nav-header {
    display: flex;
    justify-content: center;
    background: #911f91;
    height: 100px;
    margin: 0;
    align-items: center;
    font-weight: 900;
    color: white;
}

.nav-header img {
    height: 100px;
}
</style>
