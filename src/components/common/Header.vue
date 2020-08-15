<template>
  <div class="header" flex="cross:center">
    <img src="/images/logo.png" class="logo" />
    <a-icon
      class="m-l-30 pointer"
      type="home"
      :style="{ fontSize: '22px', color: '#fff' }"
      @click="handleHome"
    />
    <a-button-group class="m-l-14">
      <a-button ghost size="small" icon="left" @click="handleBack" />
      <a-button ghost size="small" icon="right" @click="handleForward" />
    </a-button-group>
    <span flex-box="1" />
    <a-dropdown :getPopupContainer="getPopupContainer" placement="bottomRight">
      <span class="mode" v-if="loginType === 'internet'">互联网模式</span>
      <span class="mode" v-else-if="loginType === 'local'">局域网模式</span>
      <a-icon type="down" />
      <a-menu slot="overlay" @click="handleClickMenu">
        <a-menu-item key="logout">
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <div class="action-bar m-l-16 p-l-16" flex="cross:center">
      <a-icon type="minus" class="pointer" @click="handleMinimize" />
      <a-icon type="border" class="pointer m-l-8" @click="handleMaximize" />
      <a-icon type="close" class="pointer m-l-8" @click="handleQuit" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Header',
  computed: {
    ...mapState(['loginType']),
  },
  methods: {
    getPopupContainer() {
      return document.getElementById('layoutHeader');
    },
    handleHome() {
      const routeName = this.$route.name;
      if (routeName !== 'Home') {
        this.$router.replace({ name: 'Home' });
      }
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleForward() {
      this.$router.go(1);
    },
    handleMinimize() {
      this.$ipcRenderer.invoke('channel', { type: 'minimize' });
    },
    handleMaximize() {
      this.$ipcRenderer.invoke('channel', { type: 'maximize' });
    },
    handleQuit() {
      this.$ipcRenderer.invoke('channel', { type: 'quit' });
    },
    handleClickMenu({ key }) {
      switch (key) {
        case 'logout':
          this.handleLogout();
          break;

        default:
          break;
      }
    },
    handleLogout() {
      this.$confirm({
        title: '退出登录确认',
        content: '是否确认退出登录？',
        onOk: () => {
          this.$ls.remove('loginType');
          this.$ls.remove('token');
          this.$ls.remove('code');
          this.$message.success('退出登录成功！');
          this.$ipcRenderer.invoke('channel', { type: 'logout' });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 100%;
  color: #fff;
  .logo {
    -webkit-app-region: drag;
    height: 24px;
    cursor: move;
  }
  .action-bar {
    height: 16px;
    border-left: 1px solid rgba(255, 255, 255, 0.35);
  }
  .mode {
    line-height: 2;
  }
}
</style>