<template>
  <div class="page">
    <div class="search-bar" flex="cross:center">
      <a-select
        allowClear
        placeholder="全部"
        class="w-150"
        @change="handleSelect"
      >
        <a-select-option key="todo" :value="1">待进行</a-select-option>
        <a-select-option key="doing" :value="2">进行中</a-select-option>
        <a-select-option key="done" :value="3">已结束</a-select-option>
      </a-select>
      <span flex-box="1"></span>
      <a-input-search
        class="w-200"
        v-model="conditions.name"
        placeholder="搜索活动"
        @search="handleSearch"
      />
    </div>
    <a-list
      itemLayout="vertical"
      :dataSource="activites"
      :loading="loading"
      :split="false"
      rowKey="id"
    >
      <a-list-item slot="renderItem" slot-scope="item">
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
    ...mapState(['activites']),
  },
  created() {
    this.handleSearch();
  },
  methods: {
    ...mapActions(['getActivities']),
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
