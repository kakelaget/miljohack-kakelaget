<template>
    <div class="nav-container"
        v-bind:class="{ night: dark }">
        <div class="nav-header">
            Ruter nå
        </div>
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
    background: #f5f5f5;
    color: black;
    font-weight: bolder;
    font-size: 2rem;
    padding: 40px;
}
</style>
