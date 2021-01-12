<template>
  <div class="page">
    <div :class="['card', `status-${status}`]" flex="cross:center">
      <div class="content" flex-box="1">
        <p class="name text-hidden">
          {{ name }}
        </p>
        <p v-show="address" class="date m-t-14">
          <span class="m-r-16">地</span>址：{{ address }}
        </p>
      </div>
      <div class="date-box" flex="cross:center">
        <div class="v-line"></div>
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
      <div class="m-l-64" style="min-width: 50px">
        <div
          v-if="loginType === 'local'"
          class="action-bar m-b-12"
          flex="cross:center"
        >
          <img
            src="/images/icon_button_edit.png"
            class="icon pointer"
            @click="handleEdit"
          />
          <img
            src="/images/icon_button_delete.png"
            class="icon pointer m-l-17"
            @click="handleDelete"
          />
        </div>
        <p>
          <span v-if="status === 1" class="status"> 待进行 </span>
          <span v-else-if="status === 2" class="status primary"> 进行中 </span>
          <span v-else-if="status === 3" class="status done">已结束</span>
        </p>
      </div>
    </div>
    <div class="m-t-24">
      <a-button class="no-padding" type="link" @click="handleCreate">
        <img class="btn-icon-add" src="/images/add.png" />
        <span class="btn-text-add">创建屏幕</span>
      </a-button>
      <template v-for="date in sortDates">
        <ScreenPanel :key="date" :date="date" :screens="group[date]" />
      </template>
    </div>
    <ActivityModal ref="modal" @confirm="handleRefresh" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ScreenPanel from '@/components/ScreenPanel';
import ActivityModal from '@/components/ActivityModal';

export default {
  name: 'Activity',
  components: {
    ScreenPanel,
    ActivityModal,
  },
  computed: {
    ...mapState(['loginType']),
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
    ...mapActions('activity', ['setActivity', 'deleteActivity']),
    ...mapActions('screen', ['getScreens']),
    handleCreate() {
      this.$router.push({ name: 'CreateScreen' });
    },
    handleEdit() {
      this.$refs.modal.open(this.selected);
    },
    handleDelete() {
      this.$confirm({
        title: '删除提示',
        content:
          '删除活动会连带删除该活动下的所有分享和素材，且无法恢复，请确认是否删除该活动?',
        onOk: () => {
          return this.deleteActivity(this.selected.id).then(() => {
            this.$message.success();
            return Promise.resolve();
          });
        },
      });
    },
    handleRefresh(activity) {
      this.setActivity(activity);
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 32px 30px;
  line-height: 1;
  border-radius: 5px;
  overflow: hidden;
  height: 144px;
  box-sizing: border-box;
  &.status-1 {
    border-left: 3px solid #fdcfcf;
  }
  &.status-2 {
    border-left: 3px solid #f60f0f;
  }
  &.status-3 {
    border-left: 3px solid #b8b8b8;
  }

  .icon {
    width: 14.57px;
    height: 14.57px;
  }
  .calendar {
    width: 48px;
    height: 48px;
  }
  .content {
    min-width: 0;
    height: 80px;
  }
  .name {
    font-size: 24px;
    font-weight: 600;
    color: #333333;
    padding-right: 39px;
    line-height: 32px;
  }
  & > .date {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
  .status {
    color: #fcc3c3;
    font-size: 12px;
    line-height: 1.2;
    vertical-align: text-top;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #fa8787;
      margin-right: 6px;
      vertical-align: middle;
    }
    &.done {
      color: #939393;
      &::before {
        background-color: #939393;
      }
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
    color: #000;
    min-width: 320px;
    .v-line {
      width: 1px;
      height: 32px;
      background: #e5e5e5;
      margin-right: 39px;
    }
    .line {
      margin: 10px 20px 0;
      height: 2px;
      background: #000;
      width: 15px;
    }
    .time {
      text-align: center;
      margin-top: 4px;
    }
  }
}
</style>