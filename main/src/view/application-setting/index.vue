<script lang="ts" setup>
import { TmpPage } from '@tmp/h5-schema';

const config: TmpPage = {
  id: 'page-1',
  name: 'page1',
  type: 'page',
  layout: '',
  children: [
    {
      id: 'form-1',
      name: 'form1',
      type: 'form',
      items: [
        {
          id: 'input-1',
          name: 'input1',
          type: 'input',
          label: '姓名',
          placeholder: '请输入姓名',
          clearable: true,
        },
      ],
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
