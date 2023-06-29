<script setup lang="ts">
import { provide } from 'vue';
import { useRouter } from 'vue-router';
import { App } from '@tmp/h5-core';
import { TmpPage } from '@tmp/h5-schema';
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
              sourceScope: 'event',
              source: 'value',
            },
          ],
        },
        {
          event: 'change',
          actionType: 'component-control',
          target: 'select-sex',
          method: 'setItems',
          propMappings: [
            {
              name: 'newItems',
              ignore: false,
              defaultValue: '1',
              sourceScope: 'expression',
              expression: `[{value: '0', title: '男生'}, {value: '1', title: '女生'}]`,
            },
          ],
        },
      ],
    },
    {
      id: 'card1',
      name: 'card1',
      type: 'card',
      title: '标题',
      content: {
        id: 'form-1',
        name: 'userInfo',
        type: 'form',
        events: [
          {
            event: 'submit',
            actionType: 'component-control',
            target: 'text1',
            method: 'setText',
            propMappings: [
              {
                name: 'newText',
                ignore: false,
                sourceScope: 'expression',
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
            placeholder: '请输入用户名',
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
                    sourceScope: 'expression',
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
            clearable: true,
          },
          {
            id: 'select-sex',
            name: 'sex',
            type: 'select',
            label: '性别',
            defaultValue: '1',
            clearable: true,
            events: [
              {
                event: 'change',
                actionType: 'component-control',
                target: 'text1',
                method: 'setText',
                propMappings: [
                  {
                    name: 'newText',
                    ignore: false,
                    defaultValue: '1',
                    sourceScope: 'expression',
                    expression: '`用户名: ${namespace["input-userName"].value}`',
                  },
                ],
              },
            ],
            items: [
              {
                title: '男',
                value: '1',
              },
              {
                title: '女',
                value: '0',
              },
            ],
          },
        ],
      },
      actions: [
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
            {
              event: 'click',
              actionType: 'component-control',
              target: 'overlay1',
              method: 'setVisibility',
              propMappings: [
                {
                  name: 'newVisibility',
                  ignore: false,
                  sourceScope: 'expression',
                  expression: 'true',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'overlay1',
      name: 'resultOverlay1',
      type: 'overlay',
      persistent: true,
      scrim: 'yellow',
      children: [
        {
          id: 'text1',
          name: 'result',
          type: 'text',
        },
        {
          id: 'closeOverlayBtn',
          name: 'close',
          type: 'button',
          text: '关闭',
          events: [
            {
              event: 'click',
              actionType: 'component-control',
              target: 'overlay1',
              method: 'setVisibility',
              propMappings: [
                {
                  name: 'newVisibility',
                  ignore: false,
                  sourceScope: 'expression',
                  expression: 'false',
                },
              ],
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
