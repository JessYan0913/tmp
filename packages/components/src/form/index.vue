<script setup lang="ts">
import { ref } from 'vue';
import { TmpFormElement, TmpFormModel } from '@tmp/h5-schema';
import { ElButton, ElForm } from 'element-plus';

import TmpUiFormItem from './components/FormItem.vue';

defineProps<{
  config: TmpFormElement;
}>();

const value = ref<TmpFormModel>({});

const handleSubmit = () => {
  console.log('=====', value);
};
</script>

<template>
  <ElForm :model="value">
    <TmpUiFormItem
      v-for="itemElement in config.items"
      :key="itemElement.id"
      :config="itemElement"
      :model="value"
    ></TmpUiFormItem>
    <ElButton @click="handleSubmit">提交</ElButton>
  </ElForm>
</template>
