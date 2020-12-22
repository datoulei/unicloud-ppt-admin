<template>
  <a-card :class="['card', `status-${activity.status}`]">
    <div
      :class="['activity-item', activity.status === 3 && 'finished']"
      flex="cross:center"
    >
      <div class="content" flex-box="1">
        <div class="p-r-33">
          <p class="title">
            {{ activity.name }}
          </p>
          <p class="m-t-8" v-show="activity.address">
            <!-- 地址 -->
            地址：{{ activity.address }}
          </p>
        </div>
      </div>
      <div class="date-box" flex>
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
      <div flex="dir:top cross:center">
        <a-button
          :class="['w-76', `btn-status-${activity.status}`]"
          type="primary"
          @click="handleSelect"
        >
          管理
        </a-button>
        <a-button
          v-if="loginType === 'local' && activity.status === 3"
          class="m-l-10 w-76"
          type="primary"
          @click="handleDelete"
        >
          删除
        </a-button>
        <p class="m-t-10">
          <span v-if="activity.status === 1" class="status"> 待进行 </span>
          <span v-else-if="activity.status === 2" class="status primary">
            进行中
          </span>
          <span v-else-if="activity.status === 3" class="status">已结束</span>
        </p>
      </div>
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
.card {
  border-radius: 5px;
  overflow: hidden;
  &:hover {
    transform: scale(1.028911565);
    transform-origin: center;
    transition: all 0.1s ease-in-out;
  }
  &.status-1 {
    border-left: 4px solid #fdcfcf;
  }
  &.status-2 {
    border-left: 4px solid #f60f0f;
  }
  &.status-3 {
    border-left: 4px solid #b8b8b8;
  }
}
.content {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.status {
  color: #666;
  font-size: 12px;
  line-height: 1.2;
  vertical-align: text-top;
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
  &.primary {
    color: #f60f0f;
    &::before {
      background-color: #f60f0f;
    }
  }
}
.date-box {
  font-size: 14px;
  width: 350px;
  min-width: 350px;
  max-width: 350px;
  margin-right: 80px;
  .line {
    margin: 10px 20px 0;
    height: 2px;
    background: #999;
    width: 15px;
  }
  .time {
    color: #333;
    font-weight: 500;
    text-align: center;
  }
}
.finished {
  .title,
  .date-box .time {
    color: #999;
  }
}
.btn-status-1 {
  background-color: #fdcfcf;
  border-color: #fdcfcf;
}
.btn-status-2 {
  background-color: #f60f0f;
  border-color: #f60f0f;
}
.btn-status-3 {
  background-color: #b8b8b8;
  border-color: #b8b8b8;
}
</style>