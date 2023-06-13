<script setup lang="ts">
import { ref, watch } from 'vue';
import { TmpFormElement, TmpFormModel } from '@tmp/h5-schema';
import { ElForm } from 'element-plus';

import { useApp } from '../hooks/useApp';

import TmpUiFormItem from './components/FormItem.vue';

const props = defineProps<{
  config: TmpFormElement;
}>();

const { app, node, provideMethod } = useApp(props);

const value = ref<TmpFormModel>({});

watch(
  () => value.value,
  () => app?.emit('change', { node, value: value.value }),
  { deep: true }
);

provideMethod('submit', () => {
  console.log('提交数据：', value.value);

  app?.emit('submit', { node, value: value.value });
});
</script>

<template>
  <ElForm :model="value">
    <TmpUiFormItem
      v-for="itemElement in config.children"
      :key="itemElement.id"
      :config="itemElement"
      :model="value"
    ></TmpUiFormItem>
  </ElForm>
</template>
