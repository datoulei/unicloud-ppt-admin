<template>
  <a-modal
    width="480px"
    :visible="visible"
    :title="recordId ? '编辑主日程' : '创建主日程'"
    :confirmLoading="loading"
    :maskClosable="false"
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
      <a-form-model-item label="开始时间" prop="startDate">
        <a-date-picker
          v-model="form.startDate"
          format="YYYY/MM/DD HH:mm"
          show-time
          style="width: 240px;"
        ></a-date-picker>
      </a-form-model-item>
      <a-form-model-item label="结束时间" prop="endDate">
        <a-date-picker
          v-model="form.endDate"
          format="YYYY/MM/DD HH:mm"
          show-time
          :disabledDate="(date) => date.isBefore($moment(form.startDate))"
          style="width: 240px;"
        ></a-date-picker>
      </a-form-model-item>
      <a-form-model-item label="主日程名称" prop="name">
        <a-input
          v-model="form.name"
          placeholder="请输入主日程名称"
          style="width: 240px;"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'MainScheduleModal',
  data() {
    const endDateValidator = (rule, value, cb) => {
      if (this.form.startDate) {
        const isValid = this.$moment(value).isAfter(
          this.$moment(this.form.startDate),
        );
        if (isValid) {
          cb();
        } else {
          cb(new Error('结束时间不能遭遇开始时间'));
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
        startDate: null,
        endDate: null,
        name: null,
      },
      rules: {
        startDate: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
        ],
        endDate: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: endDateValidator, trigger: 'change' },
        ],
        name: [
          { required: true, message: '主日程名称不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    ...mapActions('mainSchedule', ['createMainSchedule', 'updateMainSchedule']),
    open(record) {
      this.visible = true;
      if (record) {
        this.recordId = record.id;
        this.form = this.$lodash.cloneDeep(record);
      }
    },
    close() {
      this.visible = false;
      this.recordId = null;
      this.form = {
        startDate: null,
        endDate: null,
        name: null,
      };
      this.$refs.form.clearValidate();
    },
    async handleSubmit() {
      this.loading = true;
      try {
        await this.$refs.form.validate();
        if (this.recordId) {
          await this.updateMainSchedule(this.form);
          this.$message.success('修改成功');
        } else {
          await this.createMainSchedule(this.form);
          this.$message.success('创建成功');
        }
        this.close();
        this.$emit('confirm');
      } catch (error) {}
      this.loading = false;
    },
  },
};
</script>

<style>
</style>