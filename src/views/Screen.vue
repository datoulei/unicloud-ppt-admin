<template>
  <div class="page">
    <div class="card" flex="cross:center">
      <img src="/images/icon_screen.png" class="icon" />
      <div>
        <p class="name">{{ screen.name }}</p>
        <p class="date m-t-12">活动名称：{{ name }}</p>
        <p class="date m-t-12">活动时间：{{ startDate }} - {{ endDate }}</p>
      </div>
    </div>
    <div class="m-t-24">
      <a-button class="no-padding" type="link" @click="handleCreate">
        <a-icon theme="filled" type="plus-circle" />
        创建主日程
      </a-button>
    </div>
    <div class="m-t-16" style="background-color: #fff">
      <a-table
        ref="table"
        :dataSource="mainSchedules"
        rowKey="id"
        :pagination="false"
      >
        <a-table-column
          key="startTime"
          data-index="startTime"
          title="主日程开始时间"
          width="200px"
        />
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
    name() {
      try {
        return this.activity.name;
      } catch (error) {
        return '';
      }
    },
    startDate() {
      try {
        return this.$moment(this.activity.startTime).format(
          'YYYY年MM月DD日 HH:mm',
        );
      } catch (error) {
        return '';
      }
    },
    endDate() {
      try {
        return this.$moment(this.activity.endTime).format(
          'YYYY年MM月DD日 HH:mm',
        );
      } catch (error) {
        return '';
      }
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
    font-family: PingFangTC-Semibold, PingFangTC;
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