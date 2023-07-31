<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { SideBarData } from '@editor/type';

import TabPane from './TabPane.vue';

export default defineComponent({
  name: 'MSidebar',
  components: { TabPane },

  props: {
    // 左侧展示侧边栏标题
    // 默认组件列表、当前 page 所有 component 层级
    data: {
      type: Object as PropType<SideBarData>,
      default: () => ({ type: 'tabs', status: '组件', items: ['component-list', 'layer'] }),
    },
  },

  setup(props) {
    const activeTabName = ref(props.data?.status);

    watch(
      () => props.data?.status,
      (status) => {
        activeTabName.value = status || '0';
      }
    );

    return {
      activeTabName,
    };
  },
});
</script>

<template>
  <el-tabs
    v-if="data.type === 'tabs' && data.items.length"
    v-model="activeTabName"
    class="m-editor-sidebar"
    type="card"
    tab-position="left"
  >
    <TabPane v-for="(item, index) in data.items" :key="index" :data="item"> </TabPane>
  </el-tabs>
</template>
