<template>
	<div class="accordion-container">
        <ul>
            <li v-for="(accordionItem, index) in accordionItems"
                v-bind:class="{ active: (activeElement == index) }"
                v-on:click="activeElement = index">
                <div class="accordion-header">
                    {{accordionItem.title}}
                </div>
                <div class="accordion-body">
                    <component :is="accordionItem.Component"></component>
                </div>
            </li>
        </ul>
	</div>
</template>

<script>
    export default {
        props: {
            accordionItems: {
                type: Array,
                required: true
            },
        },
        data(){
            return {
                activeElement: 0,
            }
        }
    }
</script>

<style>
    .accordion-container {
        height: 100%;
    }
    .accordion-container ul {
        list-style: none;
        overflow: auto;
        margin: 0;
        height: inherit;
        padding: 0;
        display: flex;
        flex-direction: column;
    }
    .accordion-container ul li {
        font-size: 1rem;
        color: white;
        padding: 20px 0 0 0;
        background: #e0e0e0;
        border-bottom: 1px solid #9e9e9e22;
        cursor: pointer;
        height:50px;
        transition: background .6s;
    }

    .accordion-container ul li.active, .accordion-container ul li.active:hover {
        background: #bdbdbd;
        height: 100%;
        display:flex;
        flex-direction: column;
    }

    .accordion-container ul li:hover {
        background: #f0f0f0;
    }

    div.accordion-header {
        font-size: 1.2rem;
        color: black;
        padding: 0 20px 20px 20px;
        padding-bottom: 20px;
    }

    div.accordion-body {
        background: #f5f5f5;
        overflow: hidden;
        flex: 0;
        display: flex;
        cursor: default;
        flex-direction: column;
        margin-bottom: -1px;
        border-bottom: 1px solid #9e9e9e22;
        padding: 0;
        color: black;
        height: 0px;
    }

    li.active div.accordion-body {
        overflow: auto;
        flex: 1;
    }
</style>
