<template>
  <a-upload
    class="file-uploader"
    :action="action"
    :accept="accept"
    :beforeUpload="beforeUpload"
    :remove="handleRemove"
    :openFileDialogOnClick="!loading"
    :showUploadList="showUploadList"
    :fileList="fileList"
    @change="handleChange"
  >
    <slot v-bind:loading="loading"></slot>
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
      default: '',
    },
    limitSize: {
      type: Number,
      default: 10,
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.fileList = [
            {
              uid: Date.now(),
              name: val.split('/').pop(),
            },
          ];
        } else {
          this.fileList = [];
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      loading: false,
      action: process.env.VUE_APP_BASE_URL + '/files',
      fileList: [],
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
        this.fileList = info.fileList;
        return;
      }
      if (info.file.status === 'done') {
        this.loading = false;
        const url = this.$lodash.get(info, 'file.response');
        this.$emit('input', url);
      }
    },
    handleRemove() {
      this.fileList = [];
      this.$emit('input', null);
    },
  },
};
</script>
