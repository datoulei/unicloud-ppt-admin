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
        :dataSource="sortScreens"
        :grid="{ gutter: 16, column: 3 }"
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
  computed: {
    sortScreens() {
      return this.$lodash.sortBy(this.screens, 'id');
    },
  },
};
</script>

<style lang="less" scoped>
.date {
  width: 220px;
  height: 44px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  border-left: 3px solid #f60f0f;
  padding-left: 13px;
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