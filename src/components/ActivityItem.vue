<template>
  <a-card>
    <div
      :class="['activity-item', activity.status === 3 && 'finished']"
      flex="cross:center"
    >
      <div class="content">
        <div>
          <p class="title">{{ activity.name }}</p>
          <p class="m-t-8">
            <span v-if="activity.status === 1" class="status primary">
              待进行
            </span>
            <span v-else-if="activity.status === 2" class="status">进行中</span>
            <span v-else-if="activity.status === 3" class="status">已结束</span>
          </p>
        </div>
      </div>
      <div class="date-box m-t-16" flex-box="1" flex>
        <div class="start">
          <p class="date">{{ startDate }}</p>
          <p class="time">{{ startTime }}</p>
        </div>
        <div class="line"></div>
        <div class="end">
          <p class="date">{{ endDate }}</p>
          <p class="time">{{ endTime }}</p>
        </div>
      </div>
      <a-button type="primary" @click="handleSelect">管理</a-button>
      <a-button
        v-if="loginType === 'local' && activity.status === 3"
        class="m-l-10"
        type="primary"
        @click="handleDelete"
      >
        删除
      </a-button>
    </div>
  </a-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  props: {
    activity: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['loginType']),
    startDate() {
      return this.$moment(this.activity.startTime).format('YYYY年MM月DD日');
    },
    startTime() {
      return this.$moment(this.activity.startTime).format('HH:mm');
    },
    endDate() {
      return this.$moment(this.activity.endTime).format('YYYY年MM月DD日');
    },
    endTime() {
      return this.$moment(this.activity.endTime).format('HH:mm');
    },
  },
  methods: {
    ...mapActions('activity', ['selectActivity', 'deleteActivity']),
    handleSelect() {
      this.selectActivity(this.activity);
      this.$router.push({
        name: 'Activity',
        params: { activityId: this.activity.id },
      });
    },
    handleDelete() {
      this.$confirm({
        title: '删除提示',
        content:
          '删除活动会连带删除该活动下的所有分享和素材，且无法恢复，请确认是否删除该活动?',
        onOk: () => {
          return this.deleteActivity(this.activity.id).then(() => {
            this.$message.success();
            return Promise.resolve();
          });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}
.content {
  min-width: 640px;
  max-width: 640px;
}
.status {
  color: #666;
  font-size: 12px;
  line-height: 1.2;
  vertical-align: text-top;
  .primary {
    color: #f60f0f;
  }
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #b8b8b8;
    margin-right: 6px;
    vertical-align: middle;
  }
}
.date-box {
  .date {
    font-size: 14px;
  }
  .line {
    margin: 10px 20px 0;
    height: 2px;
    background: #999;
    width: 15px;
  }
  .time {
    color: #333;
    font-size: 20px;
    font-weight: 500;
  }
}
.finished {
  .title,
  .date-box .time {
    color: #999;
  }
}
</style>