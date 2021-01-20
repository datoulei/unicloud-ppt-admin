<template>
  <div class="page">
    <a-card :title="screenId ? '编辑屏幕' : '创建屏幕'">
      <a-form-model
        class="form"
        ref="form"
        :model="form"
        :rules="rules"
        :labelCol="{ span: 3 }"
        :wrapperCol="{ span: 21 }"
      >
        <a-form-model-item label="屏幕名称" prop="name">
          <a-input
            class="w-240 m-l-15"
            v-model="form.name"
            placeholder="请输入屏幕名称"
          />
        </a-form-model-item>
        <a-form-model-item label="展示名称" prop="displayName">
          <a-input
            class="w-240 m-l-15"
            v-model="form.displayName"
            placeholder="请输入展示名称"
          />
        </a-form-model-item>
        <a-form-model-item label="日期" prop="date">
          <a-date-picker
            class="w-240 m-l-15"
            v-model="form.date"
            inputReadOnly
            valueFormat="YYYY-MM-DD"
          />
        </a-form-model-item>
        <a-form-model-item label="屏幕Logo" prop="logo">
          <ImageUpload
            class="m-l-15"
            v-model="form.logo"
            modalWidth="700px"
            width="240px"
            height="120px"
            cropper
            :cropperWidth="640"
            :cropperHeight="320"
          />
          <div class="upload-extra">
            <span
              class="btn pointer"
              v-show="form.logo"
              @click="form.logo = null"
            >
              清空
            </span>
            <p class="tips">建议上传尺寸：640 * 320</p>
          </div>
        </a-form-model-item>
        <a-form-model-item label="屏幕风格" prop="style">
          <div class="style-radio-group" flex>
            <div
              :class="[
                'style-radio-item',
                'blue',
                form.style === 'blue' && 'checked',
              ]"
              @click="form.style = 'blue'"
            />
            <div
              :class="[
                'style-radio-item',
                'red',
                form.style === 'red' && 'checked',
              ]"
              @click="form.style = 'red'"
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
        <a-form-model-item :wrapperCol="{ offset: 3 }">
          <a-button
            class="m-l-15"
            :loading="loading"
            type="primary"
            @click="handleSubmit"
          >
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
        style: 'blue',
      },
      rules: {
        name: [
          { required: true, message: '屏幕名称不能为空', trigger: 'blur' },
        ],
        displayName: [
          { required: true, message: '展示名称不能为空', trigger: 'blur' },
        ],
        date: [{ required: true, message: '日期不能为空', trigger: 'change' }],
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
  width: 270px;
  height: 121px;
  cursor: pointer;
  position: relative;
  // background: rgba(0, 0, 0, 0.46);
  background-size: cover;
  background-repeat: no-repeat;
  &::before {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    top: 116px;
    left: 127px;
    background-image: url('/images/checkbox.png');
    background-size: cover;
  }
  &.checked::before {
    background-image: url('/images/checkbox_checked.png');
  }
  &.blue {
    background-image: url('/images/img_style_blue.png');
  }
  &.red {
    background-image: url('/images/img_style_red.png');
  }
  &.light {
    background-image: url('/images/img_style_light.png');
  }
}
.w-240 {
  width: 240px;
}
.upload-extra {
  display: inline-block;
  vertical-align: bottom;
  margin-left: 14px;
  .btn {
    height: 16px;
    font-size: 11px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: #f60f0f;
    line-height: 16px;
  }
  .tips {
    height: 16px;
    font-size: 11px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
  }
}
.form {
  ::v-deep {
    .ant-form-explain {
      margin-left: 15px;
    }
  }
}
</style>