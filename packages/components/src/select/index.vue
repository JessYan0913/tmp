<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TmpFormModel } from '@tmp/h5-schema';
import { ElOption, ElSelect } from 'element-plus';

import { TmpSelect } from './types';

const props = defineProps<{
  config: TmpSelect;
  model?: TmpFormModel;
  prop?: string;
  modelValue?: string;
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const value = ref<string>(props.modelValue ?? props.config.defaultValue ?? '');

watch(
  () => value.value,
  () => emits('update:modelValue', value.value),
  { immediate: true }
);
</script>

<template>
  <ElSelect v-model="value" :placeholder="config.placeholder" :clearable="config.clearable">
    <ElOption v-for="({ label, value }, index) in config.options" :key="index" :label="label" :value="value">
      {{ label }}
    </ElOption>
  </ElSelect>
</template>
