<template>
  <a-upload
    class="image-uploader"
    :action="action"
    :accept="accept"
    :list-type="listType"
    :show-upload-list="showUploadList"
    :beforeUpload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="value" :src="value" alt="avatar" :style="{ width, height }" />
    <div
      v-else
      flex="dir:top main:center cross:center"
      :style="{ width, height }"
    >
      <a-icon :type="loading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">
        {{ placeholder }}
      </div>
    </div>
  </a-upload>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '.png, .jpg, .jpeg, .bmp',
    },
    placeholder: {
      type: String,
      default: '上传图片',
    },
    listType: {
      type: String,
      default: 'picture-card',
    },
    showUploadList: {
      type: Boolean,
      default: false,
    },
    limitSize: {
      type: Number,
      default: 2,
    },
    width: {
      type: String,
      default: '128px',
    },
    height: {
      type: String,
      default: '128px',
    },
  },
  data() {
    return {
      loading: false,
      action: '',
    };
  },
  methods: {
    beforeUpload(file) {
      const isLimitSize = file.size / 1024 / 1024 < this.limitSize;
      if (!isLimitSize) {
        this.$message.error(`请上传${this.limitSize}M以内的图片！`);
      }
      return isLimitSize;
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        const url = this.$lodash.get(info, 'file.response.data.url');
        this.$emit('input', url);
      }
    },
  },
};
</script>

<style lang="less">
.image-uploader {
  .ant-upload {
    width: 128px;
    height: 128px;
  }
}
</style>