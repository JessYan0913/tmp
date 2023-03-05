<script setup lang="ts">
import { ref } from 'vue';
import { TmpFormElement, TmpFormModel } from '@tmp/h5-schema';
import { ElForm } from 'element-plus';

import TmpUiComponent from '../Component.vue';

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
    <TmpUiComponent
      v-for="itemElement in config.items"
      :key="itemElement.id"
      :config="itemElement"
      :model="value"
    ></TmpUiComponent>
    <button @click="handleSubmit">提交</button>
  </ElForm>
</template>
