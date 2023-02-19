<script lang="ts" setup>
import { TmpPage } from '@tmp/h5-schema';

import TmpComponent from '../Component.vue';

const props = defineProps<{
  config: TmpPage;
}>();

console.log('====', props.config);
</script>

<template>
  <div>
    也让吗
    <slot></slot>
    <TmpComponent v-for="itemElement in config.children" :key="itemElement.id" :config="config"></TmpComponent>
  </div>
</template>
