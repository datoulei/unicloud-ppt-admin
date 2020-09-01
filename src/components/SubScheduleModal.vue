<template>
  <a-modal
    width="480px"
    :visible="visible"
    :title="recordId ? '编辑子日程' : '创建子日程'"
    :confirmLoading="loading"
    @cancel="close"
    @ok="handleSubmit"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 18 }"
    >
      <a-form-model-item label="开始时间" prop="startTime">
        <a-time-picker
          v-model="form.startTime"
          format="HH:mm"
          valueFormat="HH:mm"
          style="width: 240px;"
        ></a-time-picker>
      </a-form-model-item>
      <a-form-model-item label="结束时间" prop="endTime">
        <a-time-picker
          v-model="form.endTime"
          format="HH:mm"
          valueFormat="HH:mm"
          style="width: 240px;"
        ></a-time-picker>
      </a-form-model-item>
      <a-form-model-item label="子日程名称" prop="name">
        <a-input
          v-model="form.name"
          placeholder="请输入子日程名称"
          style="width: 240px;"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item label="头像" prop="avatar">
        <ImageUpload
          v-model="form.avatar"
          width="64px"
          height="64px"
          placeholder="上传"
        />
      </a-form-model-item>
      <a-form-model-item label="身份类型" prop="identity">
        <a-input
          v-model="form.identity"
          placeholder="请输入身份类型"
          style="width: 240px;"
        />
      </a-form-model-item>
      <a-form-model-item label="姓名" prop="guestName">
        <!-- <a-input
          v-model="form.guestName"
          placeholder="请输入姓名"
          style="width: 240px;"
        /> -->
        <a-auto-complete
          v-model="form.guestName"
          :filterOption="attendeeFilter"
          :defaultOpen="false"
          placeholder="请输入姓名"
          style="width: 240px;"
          @select="handleSelect"
        >
          <template slot="dataSource">
            <a-select-option v-for="item in attendees" :key="item.name">
              {{ item.name }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </a-form-model-item>
      <a-form-model-item label="单位名称" prop="work">
        <a-input
          v-model="form.work"
          placeholder="请输入单位名称"
          style="width: 240px;"
        />
      </a-form-model-item>
      <a-form-model-item label="子日程ppt" prop="ppt">
        <FileUpload v-model="form.ppt" accept=".ppt, .pptx, .pps, .ppsx, .pdf">
          <template slot-scope="{ loading }">
            <a-button :loading="loading" type="primary" icon="upload">
              上传文件
            </a-button>
          </template>
        </FileUpload>
      </a-form-model-item>
      <a-form-model-item label="PPT演讲时长" prop="minutes">
        <a-input-number v-model="form.minutes" :min="0" />分钟
      </a-form-model-item>
      <a-form-model-item label="倒计时显示位置" prop="position">
        <a-radio-group v-model="form.position" class="p-t-8">
          <a-radio value="leftTop" style="width: 104px;">左上角</a-radio>
          <a-radio value="leftBottom" style="width: 104px;">左下角</a-radio>
          <a-radio value="rightTop" style="width: 104px;">右上角</a-radio>
          <a-radio value="rightBottom" style="width: 104px;">右下角</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ImageUpload from '@/components/common/ImageUpload';
import FileUpload from '@/components/common/FileUpload';
export default {
  name: 'SubScheduleModal',
  components: {
    ImageUpload,
    FileUpload,
  },
  data() {
    const endTimeValidator = (rule, value, cb) => {
      if (value && this.form.startTime) {
        const startTime = this.$moment(this.form.startTime, 'HH:mm');
        const endTime = this.$moment(value, 'HH:mm');
        if (endTime.isAfter(startTime)) {
          cb();
        } else {
          cb(new Error('结束时间不能早于开始时间'));
        }
      } else {
        cb();
      }
    };
    return {
      visible: false,
      loading: false,
      recordId: null,
      form: {
        startTime: null,
        endTime: null,
        name: null,
        avatar: null,
        identity: null,
        guestName: null,
        work: null,
        ppt: null,
        minutes: 0,
        position: 'leftTop',
      },
      rules: {
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: endTimeValidator },
        ],
        avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
        name: [
          { required: true, message: '子日程名称不能为空', trigger: 'blur' },
        ],
        identity: [
          { required: true, message: '身份类型不能为空', trigger: 'blur' },
        ],
        guestName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
        ],
        work: [
          { required: true, message: '工作单位不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    ...mapState('activity', ['attendees']),
  },
  methods: {
    ...mapActions('activity', ['loadAttendees']),
    ...mapActions('subSchedule', ['createSubSchedule', 'updateSubSchedule']),
    open(record) {
      this.visible = true;
      if (record) {
        this.recordId = record.id;
        this.form = this.$lodash.cloneDeep(record);
      }
      this.loadAttendees();
    },
    close() {
      this.visible = false;
      this.recordId = null;
      this.form = {
        startTime: null,
        endTime: null,
        name: null,
        avatar: null,
        identity: null,
        guestName: null,
        work: null,
        ppt: null,
        minutes: 0,
        position: 'leftTop',
      };
      this.$refs.form.clearValidate();
    },
    async handleSubmit() {
      this.loading = true;
      try {
        await this.$refs.form.validate();
        if (this.recordId) {
          await this.updateSubSchedule(this.form);
          this.$message.success('修改成功');
        } else {
          await this.createSubSchedule(this.form);
          this.$message.success('创建成功');
        }
        this.close();
        this.$emit('confirm');
      } catch (error) {}
      this.loading = false;
    },
    attendeeFilter(inputValue, option) {
      return option.key.includes(inputValue);
    },
    handleSelect(val) {
      const work = this.attendees.find((a) => a.name === val).work;
      this.form.work = work;
    },
  },
};
</script>

<style>
</style>