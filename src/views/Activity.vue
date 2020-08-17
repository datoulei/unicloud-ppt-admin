<template>
  <div class="page">
    <div class="card" flex="cross:center">
      <img src="/images/icon_calendar.png" class="icon" />
      <div>
        <p class="name">{{ name }}</p>
        <p class="date m-t-12">活动时间：{{ startDate }} - {{ endDate }}</p>
      </div>
    </div>
    <div class="m-t-24">
      <a-button type="primary" icon="plus" @click="handleCreate">
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
    startDate() {
      try {
        return this.$moment(this.selected.startTime).format(
          'YYYY年MM月DD日 HH:mm',
        );
      } catch (error) {
        return '';
      }
    },
    endDate() {
      try {
        return this.$moment(this.selected.endTime).format(
          'YYYY年MM月DD日 HH:mm',
        );
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
  .date {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  }
}
</style>