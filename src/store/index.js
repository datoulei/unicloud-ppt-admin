import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginType: Vue.ls.get('loginType'),
    activites: []
  },
  mutations: {
    SET_ACTIVITIES(state, list) {
      state.activites = list
    }
  },
  actions: {
    async getActivities({ state, commit }, params) {
      if (state.loginType === 'internet') {
        // 互联网模式
        const result = await Vue.axios.get('/activities', { params })
        const list = result.rows.filter(row => [1, 2, 3].includes(row.status))
        commit('SET_ACTIVITIES', list)
        return result
      } else {
        // 局域网模式
      }
    }
  },
  modules: {}
});
