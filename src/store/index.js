import Vue from "vue";
import Vuex from "vuex";

import activity from './activity'
import screen from './screen'
import mainSchedule from './main-schedule'
import subSchedule from './sub-schedule'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginType: Vue.ls.get('loginType'),
  },
  modules: {
    activity,
    screen,
    mainSchedule,
    subSchedule
  }
});
