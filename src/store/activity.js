import Vue from "vue";

export default {
  namespaced: true,
  state: {
    activites: [],
    selected: null,
    attendees: []
  },
  mutations: {
    SET_ACTIVITIES(state, list) {
      state.activites = list
      return state
    },
    SET_SELECTED(state, selected) {
      state.selected = selected
      return state
    },
    SET_ATTENDEES(state, list) {
      state.attendees = list
      return state
    },
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
    async createActivity({ rootState, commit }, data) {
      if (rootState.loginType === 'internet') {
        // 互联网模式
      } else {
        // 局域网模式
        await Vue.axios.post('/activities', data)
      }
    },
    async updateActivity({ rootState, commit }, data) {
      if (rootState.loginType === 'internet') {
        // 互联网模式
      } else {
        // 局域网模式
        await Vue.axios.put(`/activities/${data.id}`, data)
      }
    },
    async deleteActivity({ rootState, commit }, id) {
      if (rootState.loginType === 'internet') {
        // 互联网模式
      } else {
        // 局域网模式
        await Vue.axios.delete(`/activities/${id}`)
      }
    },
    selectActivity({ commit }, activity) {
      commit('SET_SELECTED', activity)
    },
    async loadAttendees({ rootState, state, commit }) {
      if (rootState.loginType === 'internet') {
        const result = await Vue.axios.get(`/activities/${state.selected.id}/attendees`)
        commit('SET_ATTENDEES', result)
      }
    }
  },
}