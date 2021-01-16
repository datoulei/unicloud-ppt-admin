<template>
  <div class="screen-item">
    <div :class="['header', screen.style]">
      <p class="title text-hidden">{{ screen.name }}</p>
      <div class="sub-title m-t-4">
        <span>主日程数量：{{ screen.mainScheduleCount }}</span>
        <span class="m-l-32">PPT数量：{{ screen.pptCount }}</span>
      </div>
    </div>
    <a-row class="body" type="flex" align="middle">
      <a-col :span="6" class="main:center">
        <div class="pointer" flex="dir:top cross:center" @click="handleCopy">
          <img src="/images/icon_copy.png" alt="" class="icon" />
          <span class="label">复制登录码</span>
        </div>
      </a-col>
      <a-col :span="6" class="main:center">
        <div class="pointer" flex="dir:top cross:center" @click="handleDetail">
          <img src="/images/icon_manage.png" alt="" class="icon" />
          <span class="label">管理日程</span>
        </div>
      </a-col>
      <a-col :span="6" class="main:center">
        <div class="pointer" flex="dir:top cross:center" @click="handleEdit">
          <img src="/images/icon_edit.png" alt="" class="icon" />
          <span class="label">编辑</span>
        </div>
      </a-col>
      <a-col :span="6" class="main:center">
        <div
          class="pointer"
          flex="dir:top cross:center"
          @click="handleOpenDeleteModal"
        >
          <img src="/images/icon_delete.png" alt="" class="icon" />
          <span class="label">删除</span>
        </div>
      </a-col>
    </a-row>
    <ConfirmDeleteModal
      ref="modal"
      desc="删除后，您将无法查看此屏幕的日程及上传幻灯片<br/>
如确认删除，请在下方输入 DELETE ，确认删除"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
export default {
  props: {
    screen: {
      type: Object,
      required: true,
    },
  },
  components: {
    ConfirmDeleteModal,
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
    handleOpenDeleteModal() {
      this.$refs['modal'].open();
    },
    async handleDelete() {
      const hide = this.$message.loading('正在处理..', 0);
      try {
        await this.deleteScreen(this.screen.id);
        this.$message.success('删除成功');
        this.getScreens();
      } catch (error) {}
      hide();
    },
  },
};
</script>

<style lang="less" scoped>
.screen-item {
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  .header {
    height: 68px;
    box-sizing: border-box;
    padding: 10px 24px;
    color: #fff;
    &.red {
      background-color: #f60f0f;
    }
    &.blue {
      background-color: #2267e5;
    }
    &.light {
      background-color: #838383;
    }
    .title {
      font-size: 18px;
      font-weight: 500;
      line-height: 24px;
    }
    .sub-title {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }
  .body {
    height: 108px;
    .icon {
      width: 42px;
      height: 42px;
      &:hover {
        transform: scale(1.428571429);
        transform-origin: center;
        transition: all 0.1s ease-in-out;
      }
    }
    .label {
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
}
</style>