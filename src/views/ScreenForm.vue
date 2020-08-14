<template>
  <div class="page">
    <a-form-model
      :model="form"
      :rules="rules"
      :labelCol="{ span: 4 }"
      :wrapperCol="{ span: 20 }"
    >
      <a-form-model-item label="屏幕名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入屏幕名称" />
      </a-form-model-item>
      <a-form-model-item label="展示名称" prop="displayName">
        <a-input v-model="form.displayName" placeholder="请输入展示名称" />
      </a-form-model-item>
      <a-form-model-item label="日期" prop="date">
        <a-date-picker
          v-model="form.date"
          inputReadOnly
          valueFormat="YYYY-MM-DD"
        />
      </a-form-model-item>
      <a-form-model-item label="屏幕Logo" prop="logo">
        <ImageUpload v-model="form.logo" />
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
              'light',
              form.style === 'light' && 'checked',
            ]"
            @click="form.style = 'light'"
          />
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import ImageUpload from '@/components/common/ImageUpload';
export default {
  components: {
    ImageUpload,
  },
  data() {
    return {
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
        logo: [{ required: true, trigger: 'blur' }],
        style: [{ required: true, trigger: 'blur' }],
      },
    };
  },
};
</script>

<style lang="less" scoped>
.style-radio-item {
  width: 192px;
  height: 108px;
  cursor: pointer;
  position: relative;
  &.checked::before {
    display: block;
    width: 24px;
    height: 24px;
    position: absolute;
    top: 12px;
    right: 12px;
    background-image: url('/images/icon_checked.png');
    background-size: cover;
  }
}
</style>