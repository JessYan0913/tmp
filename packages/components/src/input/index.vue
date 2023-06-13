<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { TmpFormModel } from '@tmp/h5-schema';
import { ElInput } from 'element-plus';

import { useApp } from '../hooks/useApp';

import { TmpInput } from './types';

const props = defineProps<{
  config: TmpInput;
  model?: TmpFormModel;
  prop?: string;
  modelValue?: string;
}>();

const { app, node } = useApp(props);

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const value = ref<string>(props.modelValue ?? props.config.defaultValue ?? '');

watch(
  () => value.value,
  () => {
    app?.emit('change', { node, value: value.value });
    emits('update:modelValue', value.value);
  }
);

const showWordLimit = computed<boolean>(() => Boolean(props.config.maxLength || props.config.minLength));

const inputType = computed<string>(() => (props.config.isPassword ? 'password' : 'text'));
</script>

<template>
  <ElInput
    v-model="value"
    :placeholder="config.placeholder"
    :clearable="config.clearable"
    :maxlength="config.maxLength"
    :minlength="config.minLength"
    :show-word-limit="showWordLimit"
    :type="inputType"
  >
    <template #prepend v-if="config.prepend"> {{ config.prepend }} </template>
    <template #append v-if="config.append"> {{ config.append }} </template>
  </ElInput>
</template>
