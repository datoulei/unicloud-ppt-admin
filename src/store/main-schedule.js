import Vue from "vue";

export default {
  namespaced: true,
  state: {
    mainSchedules: [],
    selected: null
  },
  mutations: {
    SET_MAIN_SCHEDULES(state, list) {
      state.mainSchedules = list
      return state
    },
    SET_SELECTED(state, selected) {
      state.selected = selected
      return state
    }
  },
  actions: {
    async getMainSchedules({ rootState, commit }, params) {
      const screen = rootState.screen.selected
      if (rootState.loginType === 'internet') {
        // 互联网模式
        const result = await Vue.axios.get(`/screens/${screen.id}/schedules`, { params })
        const list = result.rows
        commit('SET_MAIN_SCHEDULES', list)
        return result
      } else {
        // 局域网模式
      }
    },
    async createMainSchedule({ rootState, commit }, data) {
      const screen = rootState.screen.selected
      if (rootState.loginType === 'internet') {
        await Vue.axios.post(`/screens/${screen.id}/schedules`, data)
      }
    },
    async updateMainSchedule({ rootState, commit }, data) {
      const screen = rootState.screen.selected
      if (rootState.loginType === 'internet') {
        await Vue.axios.put(`/screens/${screen.id}/schedules/${data.id}`, data)
      }
    },
    async deleteMainSchedule({ rootState, commit }, id) {
      const screen = rootState.screen.selected
      if (rootState.loginType === 'internet') {
        await Vue.axios.delete(`/screens/${screen.id}/schedules/${id}`)
      }
    },
    selectMainSchedule({ state, commit }, mainSchedule) {
      commit('SET_SELECTED', mainSchedule)
    },
  },
}