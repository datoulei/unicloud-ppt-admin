import Vue from "vue";
import db from '../db'

const Plugin = {
  install: function (Vue) {
    Vue.db = db;
    Object.defineProperties(Vue.prototype, {
      $db: {
        get() {
          return db
        }
      }
    })
  }
}

Vue.use(Plugin)