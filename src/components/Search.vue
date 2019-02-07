<template>
    <div class="search-element">
        <form @submit.prevent="processSearch">
            <div class="container-search">
                <input type="text" placeholder="Søk etter buss" class="input-field" v-model="searchText" />
                <input type="submit" value="Søk" class="input-submit" />
            </div>
        </form>
        <div class="search-result">
            <div v-for="searchResult in searchResults">
                {{searchResult}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        processSearch() {
            this.searchResults.push(this.searchText);
            this.searchText = "";
        }
    },
    data(){
        return {
            searchText: "",
            searchResults: [""]
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
