import Vue from 'vue'
import OSS from 'ali-oss'

const client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAIXGecTChl1HEP',
  accessKeySecret: 'wr8YtaLSolBWf6C1HDHKG1miwNXknz',
  bucket: 'uniecloud-sh'
})

const Plugin = {
  install: function (Vue) {
    Vue.oss = client
    Object.defineProperties(Vue.prototype, {
      $oss: {
        get() {
          return client
        }
      }
    })
  }
}

Vue.use(Plugin)