import Vuex from 'vuex';

const store = new Vuex.Store({
    state: {
        map: {},
        filterElements: [],
        filter: true,
        carCategories: [],
    },
    mutations: {
        setMap (state, map) {
            state.map = map;
        },
        setFilterElements(state, filterElements) {
            state.filterElements = filterElements
        },
        setFilter(state, filter) {
            state.filter = filter
        },
        setCarCategories(state, carCategories) {
            state.carCategories = carCategories
        }
    },
    actions: {
        setMap (context, map) {
            context.commit('setMap', map);
        },
        setFilterElements(context, filterElements) {
            context.commit('setFilterElements', filterElements);
        },
        setFilter(context, filter) {
            context.commit('setFilter', filter);
        },
        setCarCategories(context, carCategories) {
            context.commit('setCarCategories', carCategories);
        }
    },
    getters: {
        map: state => {
          return state.map;
        },
        filterElements: state => {
            return state.filterElements;
        },
        filter: state => {
            return state.filter;
        },
        carCategories: state => {
            return state.carCategories;
        }
    }
});

export default store;
