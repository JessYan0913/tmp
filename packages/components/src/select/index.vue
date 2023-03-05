<script lang="ts" setup>
import { computed } from 'vue';
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

const value = computed<string>({
  set(value: string) {
    emits('update:modelValue', value);
  },
  get(): string {
    return props.modelValue ?? props.config.defaultValue ?? '';
  },
});
</script>

<template>
  <ElSelect v-model="value" :placeholder="config.placeholder" :clearable="config.clearable">
    <ElOption v-for="({ label, value }, index) in config.options" :key="index" :label="label" :value="value">
      {{ label }}
    </ElOption>
  </ElSelect>
</template>
