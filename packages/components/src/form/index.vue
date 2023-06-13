<script setup lang="ts">
import { ref } from 'vue';
import { TmpFormElement, TmpFormModel } from '@tmp/h5-schema';
import { ElButton, ElForm } from 'element-plus';

import { useApp } from '../hooks/useApp';

import TmpUiFormItem from './components/FormItem.vue';

const props = defineProps<{
  config: TmpFormElement;
}>();

const { app, node } = useApp(props);

const value = ref<TmpFormModel>({});

const handleSubmit = () => {
  console.log('提交数据：', value.value);

  app?.emit('change', { node, value: value.value });
};
</script>

<template>
  <ElForm :model="value">
    <TmpUiFormItem
      v-for="itemElement in config.children"
      :key="itemElement.id"
      :config="itemElement"
      :model="value"
    ></TmpUiFormItem>
    <ElButton @click="handleSubmit">提交</ElButton>
  </ElForm>
</template>
