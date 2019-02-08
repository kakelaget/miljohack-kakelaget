import Vuex from 'vuex';

const store = new Vuex.Store({
    state: {
        map: {},
        filterElements: [],
    },
    mutations: {
        setMap (state, map) {
            state.map = map;
        },
        setFilterElements(state, filterElements) {
            state.filterElements = filterElements
        }
    },
    actions: {
        setMap (context, map) {
            context.commit('setMap', map);
        },
        setFilterElements(context, filterElements) {
            context.commit('setFilterElements', filterElements);
        }
    },
    getters: {
        map: state => {
          return state.map;
        },
        filterElements: state => {
            return state.filterElements;
        }
    }
});

export default store;
