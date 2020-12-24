<template>
  <div class="page">
    <div class="card" flex="cross:center">
      <img src="/images/icon_calendar.png" class="icon" />
      <div flex-box="1">
        <p class="name">{{ activityName }}</p>
        <p class="date m-t-12">{{ screenName }} - {{ mainScheduleName }}</p>
        <p class="date m-t-12">{{ screenDate }}</p>
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
        <span class="btn-text-add"> 创建子日程 </span>
      </a-button>
    </div>
    <div class="m-t-24" style="background-color: #fff">
      <a-table
        ref="table"
        :dataSource="subSchedules"
        rowKey="id"
        :pagination="false"
      >
        <a-table-column key="action" title="操作" width="200px">
          <template slot-scope="row">
            <img
              src="/images/icon_play.png"
              class="icon-button"
              @click="handlePreview(row)"
            />
            <img
              src="/images/icon_button_edit.png"
              class="icon-button"
              @click="handleEdit(row)"
            />
            <img
              src="/images/icon_button_delete.png"
              class="icon-button"
              @click="handleOpenDeleteModal(row)"
            />
            <img src="/images/icon_button_move.png" class="icon-button drag" />
          </template>
        </a-table-column>
        <a-table-column key="time" title="子日程时间" width="150px">
          <template slot-scope="item">
            <span>{{ item.startTime }}</span>
            <span>-</span>
            <span>{{ item.endTime }}</span>
          </template>
        </a-table-column>
        <a-table-column
          key="guestName"
          data-index="guestName"
          title="姓名"
          width="150px"
        />
        <a-table-column
          key="work"
          data-index="work"
          title="单位"
          width="200px"
          ellipsis
        />
        <a-table-column
          key="name"
          data-index="name"
          title="子日程名称"
          width="400px"
          ellipsis
        />
        <a-table-column key="ppt" title="PPT" width="160px">
          <template slot-scope="row">
            <span
              v-if="row.ppt"
              class="text-primary pointer"
              @click="handleDownload(row)"
            >
              {{ getFilename(row.ppt) }}
            </span>
            <FileUpload
              v-else
              accept=".ppt, .pptx, .pps, .ppsx, .pdf"
              :limitSize="10000"
              :showUploadList="false"
              @input="(url) => handleUpload(row, url)"
            >
              <template slot-scope="{ loading, percent }">
                <a-statistic
                  v-show="loading"
                  class="stat"
                  :value="percent"
                  :precision="0"
                  suffix="%)"
                >
                  <template #prefix>
                    <a-icon type="loading" spin />
                    <span class="m-l-4">上传中(</span>
                  </template>
                </a-statistic>
                <a-button
                  v-show="!loading"
                  type="link"
                  icon="upload"
                  style="padding: 0"
                >
                  上传文件
                </a-button>
              </template>
            </FileUpload>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <SubScheduleModal ref="modal" @confirm="getSubSchedules" />
    <ConfirmDeleteModal
      ref="deleteModal"
      desc="删除后，您将无法查看此子日程及上传幻灯片<br/>
如确认删除，请在下方输入 DELETE ，确认删除"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Sortable from 'sortablejs';
import SubScheduleModal from '@/components/SubScheduleModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import FileUpload from '@/components/common/FileUpload';
export default {
  components: {
    SubScheduleModal,
    ConfirmDeleteModal,
    FileUpload,
  },
  computed: {
    ...mapState(['loginType']),
    ...mapGetters('activity', ['activity']),
    ...mapGetters('screen', ['screen']),
    ...mapGetters('mainSchedule', ['mainSchedule']),
    ...mapState('subSchedule', ['subSchedules']),
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
    mainScheduleName() {
      try {
        return this.mainSchedule.name;
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
    handleOpenDeleteModal(record) {
      this.$refs.deleteModal.open(record);
    },
    async handleDelete(record) {
      try {
        await this.deleteSubSchedule(record.id);
        this.$message.success('删除成功');
        this.getSubSchedules();
      } catch (error) {}
    },
    async handleSort({ oldIndex, newIndex }) {
      console.log('handleSort -> newIndex', newIndex);
      console.log('handleSort -> oldIndex', oldIndex);
      if (newIndex === oldIndex) {
        return;
      }
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
    handlePreview({ ppt }) {
      if (this.loginType === 'local') {
        ppt = this.$db.get('baseURL').value() + '/' + ppt;
      }
      this.$ipcRenderer.invoke('channel', {
        type: 'preview',
        data: { url: ppt },
      });
    },
    handleDownload({ ppt }) {
      if (this.loginType === 'local') {
        ppt = this.$db.get('baseURL').value() + '/' + ppt;
      }
      this.$ipcRenderer.invoke('channel', {
        type: 'download',
        data: { url: ppt },
      });
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
}
.stat {
  ::v-deep {
    .ant-statistic-content,
    .ant-statistic-content-suffix {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>