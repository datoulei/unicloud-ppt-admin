<template>
  <a-modal
    :visible="visible"
    width="480px"
    :maskClosable="false"
    :okButtonProps="{ props: { disabled: buttonDisabled } }"
    @ok="submit"
    @cancel="close"
  >
    <div class="container" flex="dir:top cross:center">
      <a-icon
        type="exclamation-circle"
        :style="{ fontSize: '136px', color: '#F60F0F' }"
        theme="filled"
        class="m-b-14"
      />
      <p class="desc" v-html="desc"></p>
      <div class="wrapper">
        <a-input v-model="answer" />
        <span v-show="showError" class="error">*密码错误</span>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    desc: {
      type: String,
      defalut: '',
    },
  },
  data() {
    return {
      visible: false,
      answer: null,
      showError: false,
      item: null,
    };
  },
  computed: {
    buttonDisabled() {
      return !this.answer;
    },
  },
  methods: {
    open(item) {
      this.visible = true;
      this.item = item;
    },
    close() {
      this.visible = false;
      this.answer = null;
      this.showError = false;
      this.item = null;
    },
    submit() {
      if (this.answer !== 'DELETE') {
        this.showError = true;
      } else {
        this.showError = false;
        this.$emit('confirm', this.item);
        this.close();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding-top: 11px;
  width: 264px;
  margin: auto;
  .desc {
    font-size: 12px;
    font-weight: 400;
    color: #3c3c3c;
    line-height: 17px;
    text-align: center;
    margin-bottom: 9px;
  }
  .wrapper {
    position: relative;
    .error {
      position: absolute;
      top: 9px;
      width: 60px;
      height: 28px;
      font-size: 10px;
      font-family: PingFangTC-Regular, PingFangTC;
      font-weight: 400;
      color: #f60f0f;
      line-height: 14px;
      padding-left: 6px;
    }
  }
}
</style>