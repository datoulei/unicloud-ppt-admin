<template>
  <div class="screen-panel p-t-24 p-b-24">
    <div class="panel-header" flex="cross:center">
      <div class="date p-l-12">
        <a-icon
          type="clock-circle"
          :style="{ fontSize: '16px', color: '#f60f0f' }"
        ></a-icon>
        <span class="m-l-8">{{ $moment(date).format('YYYY年MM月DD日') }}</span>
      </div>
      <span flex-box="1"></span>
      <img src="/images/icon_down.png" class="button" @click="show = !show" />
    </div>
    <div v-show="show" class="list">
      <a-list
        class="m-t-16"
        :dataSource="screens"
        :grid="{ gutter: 24, column: 3 }"
        :split="false"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <ScreenItem :screen="item" />
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
import ScreenItem from './ScreenItem.vue';
export default {
  props: {
    screens: {
      type: Array,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  components: {
    ScreenItem,
  },
  data() {
    return {
      show: true,
    };
  },
};
</script>

<style lang="less" scoped>
.screen-panel + .screen-panel {
  border-top: 1px solid #eee;
}
.list {
  margin-bottom: -8px;
}
.date {
  width: 278px;
  height: 36px;
  background: linear-gradient(
    270deg,
    rgba(255, 233, 233, 0) 0%,
    rgba(255, 233, 233, 1) 100%
  );
  border-left: 4px solid #f60f0f;
  line-height: 36px;
  font-size: 18px;
  color: #f60f0f;
}
.button {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>