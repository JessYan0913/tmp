<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { VTextField } from 'vuetify/components/VTextField';
import { TmpFormModel } from '@tmp/h5-schema';

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
  <VTextField
    v-model="value"
    :label="config.label"
    :placeholder="config.placeholder"
    :prepend="config.prependIcon"
    :append="config.appendIcon"
    :clearable="config.clearable"
    :type="inputType"
  >
  </VTextField>
</template>
