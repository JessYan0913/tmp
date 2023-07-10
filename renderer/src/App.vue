<script setup lang="ts">
import { provide, ref, watchEffect } from 'vue';
import { App } from '@tmp/core';
import { TmpApplication } from '@tmp/schema';

const app = new App({});

provide('app', app);

const dsl = ref<TmpApplication>();

watchEffect(() => {
  if (!dsl.value) {
    return;
  }
  app.setData(dsl.value);
});
</script>

<template>
  <TmpUiPage :config="app.curPage"></TmpUiPage>
</template>

<style scoped></style>
