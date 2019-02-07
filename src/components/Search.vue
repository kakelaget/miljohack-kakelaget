<template>
    <div>
        <div class="container-search">
            <input type="text" placeholder="Søk etter buss" class="input-field" />
            <input type="submit" value="Søk" class="input-submit" />
        </div>
        <div class="search-result">
            <span>Tomt</span>
        </div>
    </div>
</template>

<style>
    .container-search {
        padding: 20px 0;
        display: flex;
        justify-content: space-around;
    }
    .input-field {
        background: transparent;
        border: none;
        border-bottom: 1px solid grey;
        padding: 10px;
        font-size: 1rem;
    }
    .input-submit {
        background: transparent;
        padding: 10px;
        font-size: 1rem;
        color: grey;
    }
    .search-result {
        padding: 20px;
    }
</style>
