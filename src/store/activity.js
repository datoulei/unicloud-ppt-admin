import Vue from "vue";

export default {
  namespaced: true,
  state: {
    activites: [],
    selected: null,
  },
  mutations: {
    SET_ACTIVITIES(state, list) {
      state.activites = list
      return state
    },
    SET_SELECTED(state, selected) {
      state.selected = selected
      return state
    }
  },
  actions: {
    async getActivities({ rootState, commit }, params) {
      if (rootState.loginType === 'internet') {
        // 互联网模式
        const result = await Vue.axios.get('/activities', { params })
        const list = result.rows.filter(row => [1, 2, 3].includes(row.status))
        commit('SET_ACTIVITIES', list)
        return result
      } else {
        // 局域网模式
      }
    },
    async createActivity({ state, commit }, data) { },
    async updateActivity({ state, commit }, params) { },
    async deleteActivity({ state, commit }, id) { },
    selectActivity({ commit }, activity) {
      commit('SET_SELECTED', activity)
    },
  },
}