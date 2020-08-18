<template>
  <a-upload
    class="image-uploader"
    :action="action"
    :accept="accept"
    :show-upload-list="showUploadList"
    :beforeUpload="beforeUpload"
    @change="handleChange"
  >
    <slot>
      <img v-if="value" :src="value" alt="avatar" :style="{ width, height }" />
      <div
        v-else
        class="placeholder"
        flex="dir:top main:center cross:center"
        :style="{ width, height }"
      >
        <a-icon
          :type="loading ? 'loading' : 'plus'"
          :style="{ color: '#999' }"
        />
        <span class="ant-upload-text">
          {{ placeholder }}
        </span>
      </div>
    </slot>
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
      action: process.env.VUE_APP_BASE_URL + '/files',
    };
  },
  methods: {
    beforeUpload(file) {
      const isLimitSize = file.size / 1024 / 1024 < this.limitSize;
      if (!isLimitSize) {
        this.$message.error(`请上传${this.limitSize}M以内的文件！`);
      }
      return isLimitSize;
    },
    handleChange(info) {
      console.log('handleChange -> info', info);
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.loading = false;
        const url = this.$lodash.get(info, 'file.response');
        this.$emit('input', url);
      }
    },
  },
};
</script>

<style lang="less">
.image-uploader {
  .placeholder {
    background: rgba(247, 247, 247, 1);
    border-radius: 2px;
    border: 1px dashed rgba(216, 216, 216, 1);
    color: #999;
    cursor: pointer;
  }
}
</style>