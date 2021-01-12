<template>
  <a-modal
    width="480px"
    :visible="visible"
    :title="recordId ? '编辑活动' : '创建活动'"
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
      <a-form-model-item label="活动名称" prop="name">
        <a-input
          v-model="form.name"
          placeholder="请输入活动名称"
          style="width: 240px"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item label="开始时间" prop="startTime">
        <a-date-picker
          v-model="form.startTime"
          format="YYYY/MM/DD HH:mm"
          show-time
          style="width: 240px"
        ></a-date-picker>
      </a-form-model-item>
      <a-form-model-item label="结束时间" prop="endTime">
        <a-date-picker
          v-model="form.endTime"
          format="YYYY/MM/DD HH:mm"
          show-time
          :disabledDate="(date) => date.isBefore($moment(form.startTime))"
          style="width: 240px"
        ></a-date-picker>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'ActivityModal',
  data() {
    const endTimeValidator = (rule, value, cb) => {
      if (this.form.startTime) {
        const isValid = this.$moment(value).isAfter(
          this.$moment(this.form.startTime),
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
        startTime: null,
        endTime: null,
        name: null,
      },
      rules: {
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: endTimeValidator, trigger: 'change' },
        ],
        name: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    ...mapActions('activity', ['createActivity', 'updateActivity']),
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
        startTime: null,
        endTime: null,
        name: null,
      };
      this.$refs.form.clearValidate();
    },
    async handleSubmit() {
      this.loading = true;
      let result = null;
      try {
        await this.$refs.form.validate();
        if (this.recordId) {
          result = await this.updateActivity(this.form);
          this.$message.success('修改成功');
        } else {
          result = await this.createActivity(this.form);
          this.$message.success('创建成功');
        }
        this.close();
        this.$emit('confirm', result);
      } catch (error) {}
      this.loading = false;
    },
  },
};
</script>

<style>
</style>