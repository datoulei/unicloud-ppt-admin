import Vue from "vue";
import 'normalize.css';
import 'flex.css';
import "./plugins/axios";
import "./plugins/antd";
import "./plugins/ls";
import "./plugins/ipcRenderer";
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
