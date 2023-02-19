<script lang="ts" setup>
import { TmpPage } from '@tmp/h5-schema';

import TmpComponent from '../Component.vue';

defineProps<{
  config: TmpPage;
}>();
</script>

<template>
  <div>
    <slot></slot>
    <TmpComponent v-for="itemElement in config.children" :key="itemElement.id" :config="itemElement"></TmpComponent>
  </div>
</template>
