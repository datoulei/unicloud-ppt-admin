<template>
  <a-upload
    class="file-uploader"
    action=""
    :accept="accept"
    :beforeUpload="beforeUpload"
    :remove="handleRemove"
    :openFileDialogOnClick="!loading"
    :showUploadList="showUploadList"
    :fileList="fileList"
    :customRequest="customRequest"
    @change="handleChange"
  >
    <slot v-bind:loading="loading" :percent="percent"></slot>
  </a-upload>
</template>

<script>
import { mapState } from 'vuex';
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
      fileList: [],
      checkpoint: null,
      percent: 0,
    };
  },
  computed: {
    ...mapState(['loginType']),
    // action() {
    //   if (this.loginType === 'local') {
    //     const baseURL = this.$db.get('baseURL').value();
    //     return baseURL + '/files';
    //   }
    //   return process.env.VUE_APP_BASE_URL + '/files';
    // },
  },
  methods: {
    beforeUpload(file) {
      const isLimitSize = file.size / 1024 / 1024 < this.limitSize;
      if (!isLimitSize) {
        this.$message.error(`请上传${this.limitSize}M以内的文件！`);
      }
      return isLimitSize;
    },
    async customRequest({ onSuccess, onError, file, onProgress }) {
      this.percent = 0;
      try {
        const result = await this.$oss.multipartUpload(
          `/uploads/${Date.now()}/${file.name}`,
          file,
          {
            progress: (progress, checkpoint) => {
              console.log('customRequest -> progress', progress);
              this.checkpoint = checkpoint;
              this.percent = progress * 100;
              onProgress({ percent: progress * 100, file });
            },
            mime: file.type,
          },
        );
        console.log('customRequest -> result', result);
        result.url = `https://uniecloud-sh.oss-cn-shanghai.aliyuncs.com${result.name}`;
        onSuccess(result, file);
      } catch (error) {
        console.log('customRequest -> error', error);
        onError(error);
      }
    },
    handleChange(info) {
      console.log('handleChange -> info', info);
      if (info.file.status === 'uploading') {
        this.loading = true;
        this.fileList = info.fileList;
        this.$emit('uploading', true);
        return;
      }
      if (info.file.status === 'done') {
        this.$emit('uploading', false);
        const url = this.$lodash.get(info, 'file.response.url');
        this.$emit('input', url);
        this.$nextTick(() => {
          this.loading = false;
        });
      }
    },
    handleRemove() {
      this.fileList = [];
      this.$emit('input', null);
    },
  },
};
</script>
