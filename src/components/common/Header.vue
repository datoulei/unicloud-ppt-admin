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
    <span class="mode">
      <span v-if="loginType === 'internet'">互联网模式</span>
      <span v-else-if="loginType === 'local'">局域网模式</span>
    </span>
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
    handleHome() {
      const routeName = this.$route.name;
      if (routeName !== 'Home') {
        this.$router.replace({ name: routeName });
      }
    },
    handleBack() {
      window.history.back();
    },
    handleForward() {
      window.history.forward();
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
}
</style>