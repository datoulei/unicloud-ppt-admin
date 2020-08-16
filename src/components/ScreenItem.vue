<template>
  <div class="screen-item">
    <div class="header">
      <p class="title">{{ screen.name }}</p>
      <div class="sub-title m-t-10">
        <span>主日程数量：{{ screen.mainScheduleCount }}</span>
        <span class="m-l-32">PPT数量：{{ screen.pptCount }}</span>
      </div>
    </div>
    <a-row class="body" type="flex" align="middle">
      <a-col :span="6" class="main:center">
        <div class="pointer" flex="dir:top cross:center" @click="handleCopy">
          <img src="/images/icon_copy.png" alt="" class="icon" />
          <span class="label m-t-8">复制登录码</span>
        </div>
      </a-col>
      <a-col :span="6" class="main:center">
        <div class="pointer" flex="dir:top cross:center" @click="handleDetail">
          <img src="/images/icon_copy.png" alt="" class="icon" />
          <span class="label m-t-8">管理日程</span>
        </div>
      </a-col>
      <a-col :span="6" class="main:center">
        <div class="pointer" flex="dir:top cross:center" @click="handleEdit">
          <img src="/images/icon_edit.png" alt="" class="icon" />
          <span class="label m-t-8">编辑</span>
        </div>
      </a-col>
      <a-col :span="6" class="main:center">
        <div class="pointer" flex="dir:top cross:center" @click="handleDelete">
          <img src="/images/icon_delete.png" alt="" class="icon" />
          <span class="label m-t-8">删除</span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    screen: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions('screen', ['deleteScreen', 'getScreens', 'selectScreen']),
    handleCopy() {
      this.$clipboard(this.screen.loginCode);
      this.$message.success('复制成功！');
    },
    handleDetail() {
      this.selectScreen(this.screen);
      this.$router.push({
        name: 'Screen',
        params: { screenId: this.screen.id },
      });
    },
    handleEdit() {
      this.$router.push({
        name: 'EditScreen',
        params: { screenId: this.screen.id },
      });
    },
    handleDelete() {
      this.$confirm({
        title: '删除确认',
        content:
          '删除屏幕会连带删除该屏幕下的分享和素材，且无法恢复，请确认是否删除该屏幕?',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          return new Promise((resolve, reject) => {
            const hide = this.$message.loading('正在处理..', 0);
            this.deleteScreen(this.screen.id)
              .then(() => {
                hide();
                this.$message.success('删除成功');
                this.getScreens();
                resolve();
              })
              .catch(() => {
                hide();
                reject();
              });
          });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.screen-item {
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  .header {
    height: 104px;
    box-sizing: border-box;
    padding: 24px;
    background-color: #f60f0f;
    color: #fff;
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    .sub-title {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .body {
    height: 104px;
    .icon {
      width: 32px;
      height: 32px;
    }
    .label {
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
}
</style>