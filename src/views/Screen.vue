<template>
  <div class="page">
    <div class="card" flex="cross:center">
      <div class="content" flex-box="1">
        <p class="name">{{ activityName }}</p>
        <p class="date m-t-12">{{ screenName }}</p>
        <p class="date">{{ screenDate }}</p>
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
      <p class="m-l-64">
        <span v-if="activity.status === 1" class="status"> 待进行 </span>
        <span v-else-if="activity.status === 2" class="status primary">
          进行中
        </span>
        <span v-else-if="activity.status === 3" class="status">已结束</span>
      </p>
    </div>
    <div class="m-t-24">
      <a-button class="no-padding" type="link" @click="handleCreate">
        <img class="btn-icon-add" src="/images/add.png" />
        <span class="btn-text-add">创建主日程</span>
      </a-button>
    </div>
    <div class="m-t-16" style="background-color: #fff">
      <a-table
        ref="table"
        :dataSource="mainSchedules"
        rowKey="id"
        :pagination="false"
      >
        <a-table-column key="startTime" title="主日程时间" width="200px">
          <template slot-scope="row">
            <span>{{ row.startTime }}</span>
            <span> - </span>
            <span>{{ row.endTime }}</span>
          </template>
        </a-table-column>
        <a-table-column key="name" data-index="name" title="主日程名称" />
        <a-table-column key="action" title="操作" width="200px">
          <template slot-scope="row">
            <img
              src="/images/icon_button_view.png"
              class="icon-button"
              @click="handleDetail(row)"
            />
            <img
              src="/images/icon_button_edit.png"
              class="icon-button"
              @click="handleEdit(row)"
            />
            <img
              src="/images/icon_button_delete.png"
              class="icon-button"
              @click="handleDelete(row)"
            />
            <img src="/images/icon_button_move.png" class="icon-button drag" />
          </template>
        </a-table-column>
      </a-table>
    </div>
    <MainScheduleModal ref="modal" @confirm="getMainSchedules" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MainScheduleModal from '@/components/MainScheduleModal';
import Sortable from 'sortablejs';
export default {
  components: {
    MainScheduleModal,
  },
  computed: {
    ...mapState('activity', { activity: (state) => state.selected }),
    ...mapState('screen', { screen: (state) => state.selected }),
    ...mapState('mainSchedule', ['mainSchedules']),
    activityName() {
      try {
        return this.activity.name;
      } catch (error) {
        return '';
      }
    },
    screenName() {
      try {
        return this.screen.name;
      } catch (error) {
        return '';
      }
    },
    screenDate() {
      try {
        return this.$moment(this.screen.date).format('YYYY年MM月DD日');
      } catch (error) {
        return '';
      }
    },
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
  created() {
    this.getMainSchedules();
  },
  mounted() {
    const el = this.$refs.table.$el.querySelector('.ant-table-tbody');
    Sortable.create(el, {
      group: {
        pull: false,
        put: false,
      },
      sort: true,
      handle: '.drag',
      draggable: '.ant-table-row',
      onEnd: (evt) => {
        this.handleSort(evt);
      },
    });
  },
  methods: {
    ...mapActions('mainSchedule', [
      'getMainSchedules',
      'selectMainSchedule',
      'updateMainSchedule',
      'deleteMainSchedule',
      'sortMainSchedules',
    ]),
    handleCreate() {
      this.$refs.modal.open();
    },
    handleDetail(record) {
      this.selectMainSchedule(record);
      this.$router.push({
        name: 'MainSchedule',
        params: { scheduleId: record.id },
      });
    },
    handleEdit(record) {
      this.$refs.modal.open(record);
    },
    handleDelete(record) {
      this.$confirm({
        title: '删除确认',
        content: '是否确认删除该日程？',
        onOk: async () => {
          try {
            await this.deleteMainSchedule(record.id);
            this.$message.success('删除成功');
            this.getMainSchedules();
          } catch (error) {}
        },
      });
    },
    async handleSort({ oldIndex, newIndex }) {
      console.log('handleSort -> newIndex', newIndex);
      console.log('handleSort -> oldIndex', oldIndex);
      if (newIndex === oldIndex) {
        return;
      }
      let leftElement, rightElement;
      const list = this.mainSchedules;
      const oldElement = this.$lodash.cloneDeep(list[oldIndex]);
      const isLast = newIndex === list.length - 1;
      const isFirst = newIndex === 0;
      if (isFirst) {
        // 拖到列表头
        rightElement = list[0];
        oldElement.order = rightElement.order / 2;
      } else if (isLast) {
        // 拖到列表尾
        leftElement = list[list.length - 1];
        oldElement.order = leftElement.order * 2;
      } else {
        // 拖到列表中间
        leftElement = list[newIndex];
        rightElement = list[newIndex + 1];
        oldElement.order = (leftElement.order + rightElement.order) / 2;
      }
      // 更新接口
      await this.updateMainSchedule(oldElement);
      this.sortMainSchedules({ oldIndex, newIndex });
      this.$message.success('操作成功');
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
  // border-left: 3px solid #f60f0f;
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
  .content {
    border-left: 3px solid #f60f0f;
    padding-left: 23px;
    .name {
      font-size: 24px;
      font-weight: 600;
      color: #333333;
    }
    .date {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
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
    position: relative;
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 1px;
      height: 32px;
      background: #e5e5e5;
      left: -40px;
      top: 5px;
    }
    .date {
      font-size: 14px;
      color: #000;
      line-height: 20px;
    }
    .line {
      margin: 10px 20px 0;
      height: 2px;
      background: #999;
      width: 15px;
    }
    .time {
      color: #333;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      line-height: 20px;
    }
  }
}
</style>