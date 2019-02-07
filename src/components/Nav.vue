<template>
    <div class="nav-container"
        v-bind:class="{ night: nightMode }">
        <div class="nav-header">
            Ruter map
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
        data(){
            return {
                accordionComponents: [
                    {
                        title: "Søk",
                        Component: Search
                    },
                    {
                        title: "Busser",
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
