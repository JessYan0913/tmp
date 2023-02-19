<script lang="ts" setup>
import { TmpPage } from '@tmp/h5-schema';

const config: TmpPage = {
  id: 'page-1',
  name: 'page1',
  type: 'page',
  layout: '',
  children: [
    {
      id: 'input-1',
      name: 'input1',
      type: 'input',
    },
  ],
};
</script>

<template>
  <div>
    <h1>应用设置</h1>
    <TmpUiPage :config="config"></TmpUiPage>
  </div>
</template>
