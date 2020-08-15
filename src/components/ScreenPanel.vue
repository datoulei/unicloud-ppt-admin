<template>
  <div class="screen-panel p-t-24">
    <div class="panel-header">
      <div class="date" flex="cross:center">
        <a-icon
          type="clock-circle"
          :style="{ fontSize: '16px', color: '#B8B8B8' }"
        ></a-icon>
        <span class="m-l-8">{{ $moment(date).format('YYYY年MM月DD日') }}</span>
      </div>
    </div>
    <div v-show="show" class="list">
      <a-list
        class="m-t-16"
        :dataSource="screens"
        :grid="{ gutter: 16, column: 2 }"
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
.date {
  font-size: 18px;
  color: #333;
  font-family: PingFangTC-Semibold, PingFangTC;
  font-weight: 600;
}
.button {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
</style>