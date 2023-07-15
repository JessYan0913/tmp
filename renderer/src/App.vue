<script setup lang="ts">
import { provide, ref, watchEffect } from 'vue';
import { App } from '@tmp/core';
import { TmpPage } from '@tmp/schema';
import { TmpApplication } from '@tmp/schema';

const page: TmpPage = {
  id: 'page1',
  type: 'page',
  path: '/index',
  title: 'index',
  children: [
    {
      id: 'card2',
      type: 'card',
      title: '价格计算器',
      children: [
        {
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
      ],
    },
  ],
};

const app = new App();

app.setData({
  id: 'myApp',
  name: 'myApp',
  type: 'app',
  layout: '',
  children: [page],
});

setTimeout(() => {
  app.curPage?.addComponent(
    {
      id: 'input1',
      type: 'input',
      placeholder: '请输入',
    },
    'card2'
  );
});

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
  <TmpUiPage :config="app.curPage?.data"></TmpUiPage>
</template>

<style lang="scss" scoped></style>
