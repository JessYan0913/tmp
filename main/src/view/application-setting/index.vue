<script lang="ts" setup>
import { TmpPage } from '@tmp/h5-schema';

const config: TmpPage = {
  id: 'page-1',
  name: 'page1',
  type: 'page',
  layout: '',
  children: [
    {
      id: 'select-1',
      name: 'select1',
      type: 'select',
      placeholder: '请选择性别',
      clearable: true,
      options: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
      ],
    },
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
          defaultValue: '32323',
        },
        {
          id: 'select-1',
          name: 'select1',
          type: 'select',
          label: '性别',
          placeholder: '请选择性别',
          clearable: true,
          options: [
            {
              label: '男',
              value: 1,
            },
            {
              label: '女',
              value: 2,
            },
          ],
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
