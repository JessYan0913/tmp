<script setup lang="ts">
import { ref, watch } from 'vue';
import { TmpFormElement, TmpFormModel } from '@tmp/h5-schema';
import { ElForm } from 'element-plus';

import { useApp } from '../hooks/useApp';

import TmpUiFormItem from './components/FormItem.vue';

const props = defineProps<{
  config: TmpFormElement;
}>();

const { app, component, provideMethod } = useApp(props);

const value = ref<TmpFormModel>({});

watch(
  () => value.value,
  () => app?.emit('change', { component, value: value.value }),
  { deep: true }
);

provideMethod('submit', () => {
  app?.emit('submit', { component, value: value.value });
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
