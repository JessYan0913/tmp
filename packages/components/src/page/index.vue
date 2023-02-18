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
    <TmpComponent :config="config"></TmpComponent>
  </div>
</template>
