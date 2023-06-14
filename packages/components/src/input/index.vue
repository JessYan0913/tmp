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

const { triggerEvent, provideMethod } = useApp(props);

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const value = ref<string>(props.modelValue ?? props.config.defaultValue ?? '');

const showWordLimit = computed<boolean>(() => Boolean(props.config.maxLength || props.config.minLength));

const inputType = computed<string>(() => (props.config.isPassword ? 'password' : 'text'));

watch(
  () => value.value,
  () => {
    triggerEvent('change', { value: value.value, model: props.model, prop: props.prop });
    emits('update:modelValue', value.value);
  }
);

provideMethod('setValue', ({ newValue }: any) => (value.value = newValue), ['newValue']);

defineExpose({
  value,
  model: props.model,
  prop: props.prop,
});
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
