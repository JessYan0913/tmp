<script lang="ts" setup>
import { watch } from 'vue';
import { TmpPage } from '@tmp/schema';

import TmpUiComponent from '../Component.vue';

const props = defineProps<{
  config: TmpPage;
}>();

watch(
  () => props.config,
  () => {
    console.log('config');
  }
);
</script>

<template>
  <div>
    <TmpUiComponent v-for="itemElement in config.children" :key="itemElement.id" :config="itemElement"></TmpUiComponent>
  </div>
</template>
