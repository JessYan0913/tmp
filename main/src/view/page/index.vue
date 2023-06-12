<script setup lang="ts">
import { TmpPage } from '@tmp/h5-schema';

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
    },
    {
      id: 'form-1',
      name: 'userInfo',
      type: 'form',
      items: [
        {
          id: 'input-userName',
          name: 'userName',
          type: 'input',
          label: '用户名',
          isPassword: true,
        },
      ],
    },
  ],
};
</script>

<template>
  <div>
    <TmpUiPage :config="page"></TmpUiPage>
  </div>
</template>
