<template>
  <div class="page">
    <div class="banner"></div>
    <div class="main" flex="dir:top main:center cross:center">
      <a-icon class="btn close-btn" type="close" @click="handleClose" />
      <div class="body">
        <a-tabs>
          <a-tab-pane key="internet" tab="互联网">
            <a-form-model class="form" ref="internetForm" :model="internetForm">
              <a-form-model-item prop="username">
                <a-input
                  v-model="internetForm.username"
                  placeholder="请输入账号"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item prop="password">
                <a-input
                  v-model="internetForm.password"
                  type="password"
                  placeholder="请输入密码"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item>
                <a-button type="primary" block>登录</a-button>
              </a-form-model-item>
            </a-form-model>
          </a-tab-pane>
          <a-tab-pane key="local" tab="局域网">
            <a-form-model class="form" ref="localForm" :model="localForm">
              <a-form-model-item prop="username">
                <a-input
                  v-model="localForm.ip"
                  placeholder="请输入群晖IP"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item prop="code">
                <a-input
                  v-model="localForm.code"
                  placeholder="请输入验证码"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item>
                <a-button type="primary" block>登录</a-button>
              </a-form-model-item>
            </a-form-model>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  data() {
    return {
      internetForm: {
        username: '',
        password: '',
      },
      localForm: {
        ip: '',
        code: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const form = await this.form.validateFields();
        const { token } = await this.$http.post('/auth/login', {
          ...form,
          type: 2,
        });
        await this.$message.success('登录成功！', 1);
        ipcRenderer.sendSync('login', token);
      } catch (error) {
        console.log(error);
      }
    },
    handleClose() {
      ipcRenderer.send('window', 'close');
    },
    openURL(url) {
      this.$electron.remote.shell.openExternal(url);
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  & > div {
    flex: 1;
  }
  .banner {
    background-image: url('/images/login-banner.png');
    background-size: cover;
    -webkit-app-region: drag;
  }
  .main {
    position: relative;
    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
    .body {
      .form {
        width: 200px;
      }
      .title {
        font-size: 24px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 33px;
        margin-bottom: 24px;
      }
      .input {
        width: 282px;
        height: 40px;
        background: rgba(243, 243, 243, 1);
        border-radius: 2px;
        border: 1px solid rgba(229, 229, 229, 1);
      }
      .login-btn {
        margin-top: 16px;
        width: 282px;
        height: 40px;
        background: #f60f0f;
        border-radius: 2px;
      }
    }
    .footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 16px;
      & > span {
        cursor: pointer;
      }
      .divider {
        margin: 0 16px;
        width: 1px;
        height: 8px;
        background: rgba(238, 238, 238, 1);
      }
    }
  }
}
</style>
