import Vue from "vue";
import Vuex from "vuex";

import activity from './activity'
import screen from './screen'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginType: Vue.ls.get('loginType'),
  },
  modules: {
    activity,
    screen
  }
});
