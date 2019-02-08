import Vuex from 'vuex';

const store = new Vuex.Store({
    state: {
        map: {}
    },
    mutations: {
        setMap (state, map) {
            state.map = map;
        }
    },
    actions: {
        setMap (context, map) {
            context.commit('setMap', map);
        }
    },
    getters: {
        map: state => {
          return state.map;
        }
    }
});

export default store;
