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
      label: '姓名',
      placeholder: '请输入姓名',
      clearable: true,
    },
    {
      id: 'input-2',
      name: 'input2',
      type: 'input',
      label: '年龄',
      placeholder: '请输入年龄',
      append: '岁',
    },
    {
      id: 'input-3',
      name: 'input3',
      type: 'input',
      label: '班级',
      placeholder: '请输入年龄',
    },
    {
      id: 'password-3',
      name: 'input4',
      type: 'input',
      label: '密码',
      placeholder: '请输入密码',
      isPassword: true,
    },
    {
      id: 'upload',
      name: 'upload4',
      type: 'upload',
      label: '附件',
      action: 'http://localhost:8890/api',
      method: 'POST',
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary3AdMUsXSUNn5QX9B',
      },
      parameters: {
        source: '${file}',
        type: 'file',
        action: 'upload',
        timestamp: 1677076472519,
        auth_token: 'ea45d54acd62aeac1df67d7a9923530f3b42e94c',
        nsfw: 0,
      },
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
