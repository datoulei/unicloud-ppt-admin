<template>
  <div class="page">
    <div class="search-bar" flex="cross:center">
      <a-select
        allowClear
        placeholder="全部"
        style="width: 150px;"
        @change="handleSelect"
      >
        <a-select-option key="todo" :value="1">待进行</a-select-option>
        <a-select-option key="doing" :value="2">进行中</a-select-option>
        <a-select-option key="done" :value="3">已结束</a-select-option>
      </a-select>
      <span flex-box="1"></span>
      <a-input-search
        style="width: 200px;"
        v-model="conditions.name"
        placeholder="搜索活动"
        @search="handleSearch"
      />
    </div>
    <a-list
      class="m-t-12"
      itemLayout="vertical"
      :dataSource="activites"
      :loading="loading"
      :split="false"
      rowKey="id"
    >
      <a-list-item
        :class="['p-t-4', 'p-b-4', item.status === 3 && 'finished']"
        slot="renderItem"
        slot-scope="item"
      >
        <ActivityItem :activity="item" />
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ActivityItem from '@/components/ActivityItem';
export default {
  components: {
    ActivityItem,
  },
  data() {
    return {
      loading: false,
      conditions: {
        status: null,
        name: null,
      },
    };
  },
  computed: {
    ...mapState('activity', ['activites']),
  },
  created() {
    this.handleSearch();
  },
  methods: {
    ...mapActions('activity', ['getActivities']),
    handleSelect(val) {
      this.conditions.status = val;
      this.handleSearch();
    },
    async handleSearch() {
      this.loading = true;
      try {
        await this.getActivities(this.conditions);
      } catch (error) {}
      this.loading = false;
    },
  },
};
</script>

<style lang="less">
.finished.ant-list-item > .ant-card {
  background: #f9f9f9;
}
</style>