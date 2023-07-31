<script lang="ts">
import { Component, defineComponent, PropType, toRaw } from 'vue';
import { Edit } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'MIcon',

  components: { Edit },

  props: {
    icon: {
      type: [String, Object] as PropType<string | Component>,
    },
  },

  setup() {
    return {
      toRaw,
    };
  },
});
</script>

<template>
  <el-icon v-if="!icon"><Edit></Edit></el-icon>
  <img v-else-if="typeof icon === 'string' && icon.startsWith('http')" :src="icon" />
  <i v-else-if="typeof icon === 'string'" :class="icon"></i>
  <el-icon v-else><component :is="toRaw(icon)"></component></el-icon>
</template>
