<template>
  <div class="inline">
    <a-upload
      class="image-uploader"
      :action="action"
      :accept="accept"
      :show-upload-list="showUploadList"
      :beforeUpload="beforeUpload"
      @change="handleChange"
    >
      <slot>
        <div v-if="value" class="preview">
          <img :src="preview" alt="avatar" :style="{ width, height }" />
        </div>
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
    <a-modal
      :visible="visible"
      title="图片裁剪"
      @ok="handleCrop"
      @cancel="cancelCrop"
      :confirmLoading="loading"
      :maskClosable="false"
    >
      <div class="cropper">
        <vueCropper
          ref="cropper"
          class="custom-cropper"
          :img="cropperImage"
          :output-type="cropperOptions.outputType"
          :can-scale="cropperOptions.canScale"
          :can-move="cropperOptions.canMove"
          :auto-crop="cropperOptions.autoCrop"
          :center-box="cropperOptions.centerBox"
          :fixed="cropperOptions.fixed"
          :full="cropperOptions.full"
          :mode="cropperOptions.mode"
          :fixed-number="[cropperWidth || 1, cropperHeight || 1]"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueCropper } from 'vue-cropper';
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
    cropper: {
      type: Boolean,
      default: false,
    },
    cropperWidth: {
      type: Number,
      default: 1,
    },
    cropperHeight: {
      type: Number,
      default: 1,
    },
  },
  components: {
    VueCropper,
  },
  data() {
    return {
      loading: false,
      visible: false,
      cropperFile: null,
      cropperImage: null,
      cropperOptions: {
        outputType: 'png',
        canScale: true,
        canMove: true,
        autoCrop: true,
        centerBox: false,
        fixed: true,
        full: true,
        mode: 'contain',
      },
      uploadResolve: null,
    };
  },
  computed: {
    ...mapState(['loginType']),
    action() {
      if (this.loginType === 'local') {
        const baseURL = this.$db.get('baseURL').value();
        return baseURL + '/files';
      }
      return process.env.VUE_APP_BASE_URL + '/files';
    },
    preview() {
      if (
        this.loginType === 'local' &&
        this.value &&
        !['/images/logo.png', '/images/default_avatar.png'].includes(this.value)
      ) {
        const baseURL = this.$db.get('baseURL').value();
        return `${baseURL}/${this.value}`;
      }
      return this.value;
    },
  },
  methods: {
    beforeUpload(file) {
      console.log(
        '🚀 ~ file: ImageUpload.vue ~ line 152 ~ beforeUpload ~ file',
        file,
      );
      const isLimitSize = file.size / 1024 / 1024 < this.limitSize;
      if (!isLimitSize) {
        this.$message.error(`请上传${this.limitSize}M以内的文件！`);
        return false;
      }
      // 判断是否需要裁剪
      if (this.cropper) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.cropperImage = e.target.result;
          this.visible = true;
          this.loading = false;
        };
        this.cropperFile = file;
        reader.readAsDataURL(file);
        return new Promise((resolve, reject) => {
          this.uploadResolve = resolve;
        });
      }
      return true;
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
    async handleCrop() {
      this.loading = true;
      this.$refs.cropper.getCropBlob(async (data) => {
        const file = new window.File([data], this.cropperFile.name, {
          type: this.cropperFile.type,
        });
        this.uploadResolve && this.uploadResolve(file);
        this.loading = false;
        this.cancelCrop();
      });
    },
    cancelCrop() {
      if (this.loading) return;
      this.visible = false;
      this.cropperFile = null;
      this.cropperImage = null;
    },
  },
};
</script>

<style lang="less">
.inline {
  display: inline-block;
  .image-uploader {
    .placeholder {
      background: rgba(247, 247, 247, 1);
      border-radius: 2px;
      border: 1px dashed rgba(216, 216, 216, 1);
      color: #999;
      cursor: pointer;
    }
    .preview {
      background-color: #f5f5f5;
    }
  }
}
.cropper {
  height: 76vh;
  background-color: #fff;
}
.custom-cropper {
  background-image: none !important;
  background-color: #f5f5f5;
}
</style>