<script setup lang="ts">
import { provide } from 'vue';
import { useRouter } from 'vue-router';
import { App } from '@tmp/h5-core';
import { TmpMappingSpace, TmpPage } from '@tmp/h5-schema';
import { ElButton } from 'element-plus';

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
              sourceScope: TmpMappingSpace.EVENT,
              source: 'value',
            },
          ],
        },
        {
          event: 'change',
          actionType: 'component-control',
          target: 'select-sex',
          method: 'setOptions',
          propMappings: [
            {
              name: 'newOptions',
              ignore: false,
              defaultValue: '1',
              sourceScope: TmpMappingSpace.EXPRESSION,
              expression: `[{value: '0', label: '男生'}, {value: '1', label: '女生'}]`,
            },
          ],
        },
      ],
    },
    {
      id: 'form-1',
      name: 'userInfo',
      type: 'form',
      events: [
        {
          event: 'submit',
          actionType: 'component-control',
          target: 'text-1',
          method: 'setText',
          propMappings: [
            {
              name: 'newText',
              ignore: false,
              sourceScope: TmpMappingSpace.EXPRESSION,
              expression: 'JSON.stringify(event.value)',
            },
          ],
        },
      ],
      children: [
        {
          id: 'input-userName',
          name: 'userName',
          type: 'input',
          label: '用户名',
          events: [
            {
              event: 'change',
              actionType: 'component-control',
              target: 'input-password',
              method: 'setValue',
              propMappings: [
                {
                  name: 'newValue',
                  ignore: false,
                  defaultValue: '1',
                  sourceScope: TmpMappingSpace.EXPRESSION,
                  expression: 'event.value + "333333333"',
                },
              ],
            },
          ],
        },
        {
          id: 'input-password',
          name: 'password',
          type: 'input',
          label: '密码',
        },
        {
          id: 'select-sex',
          name: 'sex',
          type: 'select',
          label: '性别',
          defaultValue: '1',
          events: [
            {
              event: 'change',
              actionType: 'component-control',
              target: 'text-1',
              method: 'setText',
              propMappings: [
                {
                  name: 'newText',
                  ignore: false,
                  defaultValue: '1',
                  sourceScope: TmpMappingSpace.EXPRESSION,
                  expression: '`用户名: ${namespace["input-userName"].value}`',
                },
              ],
            },
          ],
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
    {
      id: 'button-1',
      name: 'submitButton',
      type: 'button',
      text: '提交',
      events: [
        {
          event: 'click',
          actionType: 'component-control',
          target: 'form-1',
          method: 'submit',
        },
      ],
    },
    {
      id: 'text-1',
      name: 'result',
      type: 'text',
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

const router = useRouter();
const handleToEditor = () => {
  const routeUrl = router.resolve({
    path: '/page-editor',
  });
  window.open(routeUrl.href, '_blank');
};
</script>

<template>
  <div>
    <ElButton @click="handleToEditor">编辑器</ElButton>
    <TmpUiPage :config="page"></TmpUiPage>
  </div>
</template>
