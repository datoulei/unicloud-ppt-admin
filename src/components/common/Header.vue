<template>
  <div class="header drag" flex="cross:center">
    <img
      src="/images/logo.png"
      class="logo pointer no-drag"
      @click="handleHome"
    />
    <a-button-group class="m-l-14 no-drag">
      <a-button ghost size="small" icon="left" @click="handleBack" />
      <a-button ghost size="small" icon="right" @click="handleForward" />
    </a-button-group>
    <template v-if="loginType === 'local'">
      <a-popover placement="topRight">
        <template #content>
          <span>{{ code }}</span>
          <span class="m-l-10">
            <a-icon
              class="pointer"
              type="redo"
              @click="handleRefreshCode"
            ></a-icon>
          </span>
        </template>
        <span class="m-l-24 no-drag">
          <span>群晖验证码</span>
          <a-icon type="caret-down"></a-icon>
        </span>
      </a-popover>
    </template>
    <span flex-box="1" />
    <a-dropdown :getPopupContainer="getPopupContainer" placement="bottomRight">
      <span flex="cross:center">
        <a-avatar :src="avatar" :size="27" />
        <span class="m-l-10">{{ nickname }}</span>
        <a-icon class="m-l-4" type="down" />
      </span>
      <a-menu slot="overlay" @click="handleClickMenu">
        <a-menu-item key="mode">
          <span class="mode no-drag" v-if="loginType === 'internet'">
            互联网模式
          </span>
          <span class="mode no-drag" v-else-if="loginType === 'local'">
            局域网模式
          </span>
        </a-menu-item>
        <a-menu-item key="logout">
          <span>切换账号</span>
        </a-menu-item>
        <a-menu-item key="quit">
          <span>退出</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <div class="action-bar m-l-16 p-l-16 no-drag" flex="cross:center">
      <a-icon type="minus" class="pointer" @click="handleMinimize" />
      <a-icon
        :type="isMaximize ? 'switcher' : 'border'"
        class="pointer m-l-8"
        @click="handleMaximize"
      />
      <a-icon type="close" class="pointer m-l-8" @click="handleQuit" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Header',
  data() {
    return { code: null, isMaximize: false };
  },
  computed: {
    ...mapState(['loginType', 'user']),
    avatar() {
      if (this.user) {
        return this.user.avatar || '/images/default_avatar.png';
      }
      return '/images/default_avatar.png';
    },
    nickname() {
      if (this.user) {
        return this.user.nickname;
      }
      return '';
    },
  },
  watch: {
    loginType: {
      handler(loginType) {
        if (loginType === 'local') {
          this.code = this.$db.get('code').value();
        }
      },
      immediate: true,
    },
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
      this.isMaximize = !this.isMaximize;
      this.$ipcRenderer.invoke('channel', { type: 'maximize' });
    },
    handleQuit() {
      this.$confirm({
        title: '关闭应用',
        content: '是否确认关闭应用？',
        onOk: () => {
          this.$ipcRenderer.invoke('channel', { type: 'quit' });
        },
      });
    },
    handleClickMenu({ key }) {
      switch (key) {
        case 'logout':
          this.handleLogout();
          break;
        case 'quit':
          this.handleQuit();
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
          this.$db.unset('loginType').write();
          this.$db.unset('token').write();
          this.$db.unset('code').write();
          this.$message.success('退出登录成功！');
          this.$ipcRenderer.invoke('channel', { type: 'logout' });
        },
      });
    },
    async handleRefreshCode() {
      const code = await this.$axios.get('/refresh_code');
      this.$db.set('code', code).write();
      this.code = code;
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 100%;
  color: #fff;
  .logo {
    height: 24px;
  }
  .action-bar {
    height: 16px;
    border-left: 1px solid rgba(255, 255, 255, 0.35);
  }
  .mode {
    line-height: 2;
    -webkit-user-select: none;
  }
}
</style>