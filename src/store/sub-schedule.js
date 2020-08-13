import Vue from "vue";

export default {
  namespaced: true,
  state: {
    subSchedules: [],
    selected: null
  },
  mutations: {
    SET_SUB_SCHEDULES(state, list) {
      state.subSchedules = list
      return state
    },
    SET_SELECTED(state, selected) {
      state.selected = selected
      return state
    }
  },
  actions: {
    async getSubSchedules({ rootState, commit }, params) {
      const mainSchedule = rootState.mainSchedule.selected
      if (rootState.loginType === 'internet') {
        // 互联网模式
        const result = await Vue.axios.get(`/schedules/${mainSchedule.id}/children`, { params })
        const list = result.rows
        commit('SET_SUB_SCHEDULES', list)
        return result
      } else {
        // 局域网模式
      }
    },
    async createSubSchedule({ rootState, commit }, data) {
      const mainSchedule = rootState.mainSchedule.selected
      if (rootState.loginType === 'internet') {
        await Vue.axios.post(`/schedules/${mainSchedule.id}/children`, data)
      }
    },
    async updateSubSchedule({ rootState, commit }, data) {
      const mainSchedule = rootState.mainSchedule.selected
      if (rootState.loginType === 'internet') {
        await Vue.axios.put(`/schedules/${mainSchedule.id}/children/${data.id}`, data)
      }
    },
    async deleteSubSchedule({ rootState, commit }, id) {
      const mainSchedule = rootState.mainSchedule.selected
      if (rootState.loginType === 'internet') {
        await Vue.axios.delete(`/schedules/${mainSchedule.id}/children/${id}`)
      }
    },
    selectSubSchedule({ state, commit }, subSchedule) {
      commit('SET_SELECTED', subSchedule)
    },
  },
}