import Vue from "vue";

export default {
  namespaced: true,
  state: {
    screens: [],
    selected: null
  },
  mutations: {
    SET_SCREENS(state, list) {
      state.screens = list
      return state
    },
    SET_SELECTED(state, selected) {
      state.selected = selected
      return state
    }
  },
  actions: {
    async getScreens({ rootState, commit }, params) {
      const activity = rootState.activity.selected
      if (rootState.loginType === 'internet') {
        // 互联网模式
        const result = await Vue.axios.get(`/activities/${activity.id}/screens`, { params })
        const list = result.rows
        commit('SET_SCREENS', list)
        return result
      } else {
        // 局域网模式
      }
    },
    async createScreen({ state, commit }, data) { },
    async updateScreen({ state, commit }, params) { },
    async deleteScreen({ state, commit }, id) { },
    selectScreen({ state, commit }, screen) {
      commit('SET_SELECTED', screen)
    }
  },
}