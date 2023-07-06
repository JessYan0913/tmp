<script setup lang="ts">
import { provide } from 'vue';
import { useRouter } from 'vue-router';
import { App } from '@tmp/h5-core';
import { TmpPage } from '@tmp/h5-schema';
import { ElButton } from 'element-plus';

const page: TmpPage = {
  id: 'page1',
  title: 'Page',
  type: 'page',
  path: '/index',
  children: [
    {
      id: 'input1',
      type: 'input',
      events: [
        {
          event: 'change',
          actionType: 'component-control',
          target: 'inputUserName',
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
          target: 'selectSex',
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
      type: 'card',
      title: '标题',
      content: {
        id: 'form1',
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
                expression: 'JSON.stringify(event.value) + inputUserName.value',
              },
            ],
          },
        ],
        children: [
          {
            id: 'inputUserName',
            type: 'input',
            label: '用户名',
            placeholder: '请输入用户名',
            events: [
              {
                event: 'change',
                actionType: 'component-control',
                target: 'inputPassword',
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
            id: 'inputPassword',
            type: 'input',
            label: '密码',
            clearable: true,
          },
          {
            id: 'selectSex',
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
                    expression: '`用户名: ${inputUserName.value}`',
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
          id: 'button1',
          type: 'button',
          text: '提交',
          events: [
            {
              event: 'click',
              actionType: 'component-control',
              target: 'form1',
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
    {
      id: 'card2',
      type: 'card',
      title: '价格计算器',
      content: {
        id: 'form2',
        type: 'form',
        children: [
          {
            id: 'inputPrice',
            type: 'input',
            label: '单价',
            placeholder: '请输入单价',
            clearable: true,
            inputType: 'number',
            events: [
              {
                event: 'change',
                actionType: 'component-control',
                target: 'inputTotalPrice',
                method: 'setValue',
                propMappings: [
                  {
                    name: 'newValue',
                    ignore: false,
                    defaultValue: '1',
                    sourceScope: 'expression',
                    expression: 'inputPrice.value * inputNum.value',
                  },
                ],
              },
            ],
          },
          {
            id: 'inputNum',
            type: 'input',
            label: '数量',
            placeholder: '请输入数量',
            clearable: true,
            inputType: 'number',
            events: [
              {
                event: 'change',
                actionType: 'component-control',
                target: 'inputTotalPrice',
                method: 'setValue',
                propMappings: [
                  {
                    name: 'newValue',
                    ignore: false,
                    defaultValue: '1',
                    sourceScope: 'expression',
                    expression: 'inputPrice.value * inputNum.value',
                  },
                ],
              },
            ],
          },
          {
            id: 'inputTotalPrice',
            type: 'input',
            label: '总价',
            placeholder: '请输入总价',
            clearable: true,
            inputType: 'number',
          },
        ],
      },
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
