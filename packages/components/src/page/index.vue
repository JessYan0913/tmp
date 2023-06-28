<script lang="ts" setup>
import { TmpPage } from '@tmp/h5-schema';

import TmpUiComponent from '../Component.vue';

defineProps<{
  config: TmpPage;
}>();
</script>

<template>
  <v-container>
    <TmpUiComponent v-for="itemElement in config.children" :key="itemElement.id" :config="itemElement"></TmpUiComponent>
  </v-container>
</template>
