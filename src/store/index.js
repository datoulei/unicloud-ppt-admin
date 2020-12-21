import Vue from 'vue';
import Vuex from 'vuex';

import activity from './activity';
import screen from './screen';
import mainSchedule from './main-schedule';
import subSchedule from './sub-schedule';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginType: Vue.db.get('loginType').value(),
    user: null,
  },
  modules: {
    activity,
    screen,
    mainSchedule,
    subSchedule,
  },
  actions: {
    async loadUser({ commit, state }) {
      if (state.loginType === 'internet') {
        const user = await Vue.axios.get('/users/me');
        commit('SET_USER', user);
      } else {
        console.log('非互联网模式，无法获取用户');
      }
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      return state;
    },
  },
});
