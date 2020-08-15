import Vue from "vue";
import 'normalize.css';
import 'flex.css';
import "./plugins/db";
import "./plugins/axios";
import "./plugins/antd";
import "./plugins/ls";
import "./plugins/moment";
import "./plugins/ipcRenderer";
import "./plugins/lodash";
import "./plugins/mock";
import "./plugins/clipboard";
import './common.less'
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

if (process.argv.includes('main-window')) {
  const loginType = Vue.ls.get('loginType')
  const token = Vue.ls.get('token')
  const code = Vue.ls.get('code')
  if ((loginType === 'internet' && !!token) || (loginType === 'local' && !!code)) {
    Vue.ipcRenderer.invoke('channel', { type: 'init', data: { isLogin: true } });
  } else {
    Vue.ipcRenderer.invoke('channel', { type: 'init', data: { isLogin: false } });
  }
}

