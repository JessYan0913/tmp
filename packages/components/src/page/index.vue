<script lang="ts" setup>
import { TmpPage } from '@tmp/schema';

import TmpUiComponent from '../Component.vue';

defineProps<{
  config: TmpPage;
}>();
</script>

<template>
  <div>
    <TmpUiComponent v-for="itemElement in config.children" :key="itemElement.id" :config="itemElement"></TmpUiComponent>
  </div>
</template>
