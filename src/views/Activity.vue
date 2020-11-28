<template>
  <div class="page">
    <div class="card" flex="cross:center">
      <img src="/images/icon_calendar.png" class="icon" />
      <div class="content">
        <p class="name">{{ name }}</p>
        <p class="date m-t-12">地址：{{ address }}</p>
      </div>
      <div class="date-box" flex-box="1" flex>
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
      <p class="m-t-10">
        <span v-if="status === 1" class="status"> 待进行 </span>
        <span v-else-if="status === 2" class="status primary"> 进行中 </span>
        <span v-else-if="status === 3" class="status">已结束</span>
      </p>
    </div>
    <div class="m-t-24">
      <a-button class="no-padding" type="link" @click="handleCreate">
        <a-icon theme="filled" type="plus-circle" />
        创建屏幕
      </a-button>
      <template v-for="date in sortDates">
        <ScreenPanel :key="date" :date="date" :screens="group[date]" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ScreenPanel from '@/components/ScreenPanel';
export default {
  components: {
    ScreenPanel,
  },
  computed: {
    ...mapState('activity', ['selected']),
    ...mapState('screen', ['screens']),
    name() {
      try {
        return this.selected.name;
      } catch (error) {
        return '';
      }
    },
    address() {
      try {
        return this.selected.address;
      } catch (error) {
        return '';
      }
    },
    status() {
      try {
        return this.selected.status;
      } catch (error) {
        return 0;
      }
    },
    startDate() {
      try {
        return this.$moment(this.selected.startTime).format('YYYY年MM月DD日');
      } catch (error) {
        return '';
      }
    },
    endDate() {
      try {
        return this.$moment(this.selected.endTime).format('YYYY年MM月DD日');
      } catch (error) {
        return '';
      }
    },
    startTime() {
      try {
        return this.$moment(this.selected.startTime).format('HH:mm');
      } catch (error) {
        return '';
      }
    },
    endTime() {
      try {
        return this.$moment(this.selected.endTime).format('HH:mm');
      } catch (error) {
        return '';
      }
    },
    group() {
      return this.$lodash.groupBy(this.screens, 'date');
    },
    sortDates() {
      return this.$lodash.sortBy(this.$lodash.keys(this.group));
    },
  },
  created() {
    this.getScreens();
  },
  methods: {
    ...mapActions('screen', ['getScreens']),
    handleCreate() {
      this.$router.push({ name: 'CreateScreen' });
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 32px;
  line-height: 1;
  border-left: 3px solid #f60f0f;
  .icon {
    width: 48px;
    height: 48px;
    margin-left: -3px;
    margin-right: 24px;
  }
  .calendar {
    width: 48px;
    height: 48px;
  }
  .name {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
  }
  .content {
    min-width: 640px;
    max-width: 640px;
  }
  .date {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
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
      text-align: center;
    }
  }
}
</style>