import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    screens: [],
    selected: null,
  },
  getters: {
    screen: (state) => state.selected,
  },
  mutations: {
    SET_SCREENS(state, list) {
      state.screens = list;
      return state;
    },
    SET_SELECTED(state, selected) {
      state.selected = selected;
      return state;
    },
  },
  actions: {
    async getScreens({ rootState, commit }, params) {
      const activity = rootState.activity.selected;
      const result = await Vue.axios.get(`/activities/${activity.id}/screens`, {
        params,
      });
      const list = result;
      commit('SET_SCREENS', list);
      return result;
    },
    async createScreen({ rootState }, data) {
      const activity = rootState.activity.selected;
      await Vue.axios.post(`/activities/${activity.id}/screens`, data);
    },
    async updateScreen({ rootState }, data) {
      const activity = rootState.activity.selected;
      await Vue.axios.put(
        `/activities/${activity.id}/screens/${data.id}`,
        data,
      );
    },
    async deleteScreen({ rootState }, id) {
      const activity = rootState.activity.selected;
      await Vue.axios.delete(`/activities/${activity.id}/screens/${id}`);
    },
    selectScreen({ commit }, screen) {
      commit('SET_SELECTED', screen);
    },
  },
};
