<script lang="ts" setup>
import { ref, watch } from 'vue';
import { TmpFormModel } from '@tmp/h5-schema';
import { ElOption, ElSelect } from 'element-plus';

import { useApp } from '../hooks/useApp';

import { TmpOptions, TmpSelect } from './types';

const props = defineProps<{
  config: TmpSelect;
  model?: TmpFormModel;
  prop?: string;
  modelValue?: string;
}>();

const { app, node, provideMethod } = useApp(props);

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const value = ref<string>(props.modelValue ?? props.config.defaultValue ?? '');

const options = ref<TmpOptions>(props.config.options);

watch(
  () => value.value,
  () => {
    app?.emit('change', { node, value: value.value, model: props.model, prop: props.prop });
    emits('update:modelValue', value.value);
  },
  { immediate: true }
);

provideMethod('setValue', ({ newValue }: any) => (value.value = newValue), ['newValue']);

provideMethod('setOptions', ({ newOptions }: any) => (options.value = newOptions), ['newOptions']);
</script>

<template>
  <ElSelect v-model="value" :placeholder="config.placeholder" :clearable="config.clearable">
    <ElOption v-for="({ label, value }, index) in options" :key="index" :label="label" :value="value">
      {{ label }}
    </ElOption>
  </ElSelect>
</template>
