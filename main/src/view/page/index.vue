<script setup lang="ts">
import { provide } from 'vue';
import { App } from '@tmp/h5-core';
import { TmpMappingSpace, TmpPage } from '@tmp/h5-schema';

const page: TmpPage = {
  id: 'page-1',
  name: 'page-1',
  type: 'page',
  layout: '',
  children: [
    {
      id: 'input-1',
      name: 'userName',
      type: 'input',
      label: '用户名',
      events: [
        {
          event: 'change',
          actionType: 'component-control',
          target: 'input-userName',
          method: 'setValue',
          propMappings: [
            {
              name: 'newValue',
              ignore: false,
              defaultValue: '1',
              sourceScope: TmpMappingSpace.EXPRESSION,
              expression: 'Date.now()',
            },
          ],
        },
      ],
    },
    {
      id: 'form-1',
      name: 'userInfo',
      type: 'form',
      children: [
        {
          id: 'input-userName',
          name: 'userName',
          type: 'input',
          label: '用户名',
        },
        {
          id: 'input-password',
          name: 'password',
          type: 'input',
          label: '密码',
          isPassword: true,
        },
        {
          id: 'select-sex',
          name: 'sex',
          type: 'select',
          label: '性别',
          defaultValue: '1',
          options: [
            {
              label: '男',
              value: '1',
            },
            {
              label: '女',
              value: '0',
            },
          ],
        },
      ],
    },
  ],
};

const app = new App({
  data: {
    id: 'myApp-1',
    name: 'myApp',
    type: 'app',
    layout: '',
    children: [page],
  },
});

console.log(app);
provide('app', app);
</script>

<template>
  <div>
    <TmpUiPage :config="page"></TmpUiPage>
  </div>
</template>
