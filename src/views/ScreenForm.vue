<template>
  <div class="page">
    <a-card :title="screenId ? '编辑屏幕' : '创建屏幕'">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :labelCol="{ span: 3 }"
        :wrapperCol="{ span: 21 }"
      >
        <a-form-model-item label="屏幕名称" prop="name">
          <a-input
            class="w-240"
            v-model="form.name"
            placeholder="请输入屏幕名称"
          />
        </a-form-model-item>
        <a-form-model-item label="展示名称" prop="displayName">
          <a-input
            class="w-240"
            v-model="form.displayName"
            placeholder="请输入展示名称"
          />
        </a-form-model-item>
        <a-form-model-item label="日期" prop="date">
          <a-date-picker
            class="w-240"
            v-model="form.date"
            inputReadOnly
            valueFormat="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="屏幕Logo" prop="logo">
          <ImageUpload v-model="form.logo" width="120px" height="66px" />
        </a-form-model-item>
        <a-form-model-item label="屏幕风格" prop="style">
          <div class="style-radio-group" flex>
            <div
              :class="[
                'style-radio-item',
                'dark',
                form.style === 'dark' && 'checked',
              ]"
              @click="form.style = 'dark'"
            />
            <div
              :class="[
                'style-radio-item',
                'm-l-16',
                'light',
                form.style === 'light' && 'checked',
              ]"
              @click="form.style = 'light'"
            />
          </div>
        </a-form-model-item>
        <a-form-model-item :wrapperCol="{ offset: 3 }">
          <a-button :loading="loading" type="primary" @click="handleSubmit">
            保存
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import ImageUpload from '@/components/common/ImageUpload';
import { mapState, mapActions } from 'vuex';
export default {
  components: {
    ImageUpload,
  },
  data() {
    return {
      screenId: this.$route.params.screenId,
      loading: false,
      form: {
        name: null,
        displayName: null,
        date: null,
        logo: null,
        style: 'dark',
      },
      rules: {
        name: [{ required: true, trigger: 'blur' }],
        displayName: [{ required: true, trigger: 'blur' }],
        date: [{ required: true, trigger: 'blur' }],
        // logo: [{ required: true, trigger: 'blur' }],
        // style: [{ required: true, trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapState('screen', ['screens']),
  },
  mounted() {
    if (this.screenId) {
      const seleted = this.screens.find((s) => s.id == this.screenId);
      this.form = this.$lodash.cloneDeep(seleted);
    }
  },
  methods: {
    ...mapActions('screen', ['createScreen', 'updateScreen']),
    async handleSubmit() {
      this.loading = true;
      try {
        await this.$refs.form.validate();
        if (this.screenId) {
          await this.updateScreen(this.form);
        } else {
          await this.createScreen(this.form);
        }
        this.$message.success('保存成功');
        this.$router.go(-1);
      } catch (error) {}
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.style-radio-item {
  width: 192px;
  height: 108px;
  cursor: pointer;
  position: relative;
  background: rgba(0, 0, 0, 0.46);
  &.checked::before {
    content: '';
    display: block;
    width: 24px;
    height: 24px;
    position: absolute;
    top: 8px;
    right: 8px;
    background-image: url('/images/icon_checked.png');
    background-size: cover;
  }
}
.w-240 {
  width: 240px;
}
</style>