<template>
  <a-card>
    <div class="activity-item" flex="cross:center">
      <div class="content" flex-box="1">
        <div>
          <span class="title">{{ activity.name }}</span>
          <span v-if="activity.status === 1" class="status primary">
            进行中
          </span>
          <span v-else-if="activity.status === 2" class="status">进行中</span>
          <span v-else-if="activity.status === 3" class="status">已结束</span>
        </div>
        <div class="date-box m-t-10" flex>
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
      </div>
      <a-button type="primary" @click="handleSelect">管理</a-button>
    </div>
  </a-card>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    activity: {
      type: Object,
      required: true,
    },
  },
  computed: {
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
    ...mapActions('activity', ['selectActivity']),
    handleSelect() {
      this.selectActivity(this.activity);
      this.$router.push({ name: 'Activity', params: { id: this.activity.id } });
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
.status {
  margin-left: 10px;
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
  .line {
    margin: 10px 20px 0;
    height: 2px;
    background: #999;
    width: 15px;
  }
}
</style>