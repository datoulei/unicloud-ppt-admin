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
        创建子日程
      </a-button>
    </div>
    <div class="m-t-24" style="background-color: #fff;">
      <a-table
        ref="table"
        :dataSource="subSchedules"
        rowKey="id"
        :pagination="false"
      >
        <a-table-column key="time" title="起始时间" width="150px">
          <template slot-scope="item">
            <span>{{ item.startTime }}</span>
            <span>-</span>
            <span>{{ item.endTime }}</span>
          </template>
        </a-table-column>
        <a-table-column
          key="identity"
          data-index="identity"
          title="身份类型"
          width="120px"
        />
        <a-table-column
          key="guestName"
          data-index="guestName"
          title="姓名"
          width="150px"
        />
        <a-table-column
          key="name"
          data-index="name"
          title="子日程名称"
          width="400px"
        />
        <a-table-column
          key="work"
          data-index="work"
          title="单位"
          width="200px"
        />
        <!-- <a-table-column key="ppt" title="PPT" width="150px">
          <template slot-scope="row">
            <a v-if="row.ppt" :href="row.ppt" :download="getFilename(row.ppt)">
              {{ getFilename(row.ppt) }}
            </a>
            <FileUpload
              v-else
              accept=".ppt, .pptx"
              :limitSize="100"
              :showUploadList="false"
              @input="(url) => handleUpload(row, url)"
            >
              <template slot-scope="{ loading }">
                <a-button
                  :loading="loading"
                  type="link"
                  icon="upload"
                  style="padding: 0;"
                >
                  上传文件
                </a-button>
              </template>
            </FileUpload>
          </template>
        </a-table-column> -->
        <a-table-column key="action" title="操作" width="150px">
          <template slot-scope="row">
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
    <SubScheduleModal ref="modal" @confirm="getSubSchedules" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Sortable from 'sortablejs';
import SubScheduleModal from '@/components/SubScheduleModal';
import FileUpload from '@/components/common/FileUpload';
export default {
  components: {
    SubScheduleModal,
    FileUpload,
  },
  computed: {
    ...mapState('activity', ['selected']),
    ...mapState('subSchedule', ['subSchedules']),
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
  },
  created() {
    this.getSubSchedules();
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
    ...mapActions('subSchedule', [
      'getSubSchedules',
      'updateSubSchedule',
      'deleteSubSchedule',
      'sortSubSchedules',
    ]),
    handleCreate() {
      this.$refs.modal.open();
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
            await this.deleteSubSchedule(record.id);
            this.$message.success('删除成功');
            this.getSubSchedules();
          } catch (error) {}
        },
      });
    },
    async handleSort({ oldIndex, newIndex }) {
      console.log('handleSort -> newIndex', newIndex);
      console.log('handleSort -> oldIndex', oldIndex);
      let leftElement, rightElement;
      const list = this.subSchedules;
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
      await this.updateSubSchedule(oldElement);
      this.sortSubSchedules({ oldIndex, newIndex });
      this.$message.success('操作成功');
    },
    async handleUpload(row, url) {
      const form = this.$lodash.cloneDeep(row);
      form.ppt = url;
      try {
        await this.updateSubSchedule(form);
        this.$message.success('操作成功!');
        this.getSubSchedules();
      } catch (error) {}
    },
    getFilename(url) {
      const file = url.split('/').pop();
      return file;
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