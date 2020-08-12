<template>
  <a-layout>
    <a-layout-header>
      <Header />
    </a-layout-header>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import Header from '@/components/common/Header';
export default {
  components: {
    Header,
  },
};
</script>

<style lang="less">
.ant-layout-header {
  height: 48px;
  padding: 0 15px;
  background: #222;
  position: fixed;
  z-index: 1;
  width: 100%;
}
.ant-layout-content {
  margin-top: 48px;
  padding: 24px 48px;
  min-height: calc(100vh - 48px);
}
</style>