<script lang="ts" setup>
import { ref, watch } from 'vue';
import { VSelect } from 'vuetify/components/VSelect';
import { TmpFormModel } from '@tmp/h5-schema';

import { useApp } from '../hooks/useApp';

import { TmpItems, TmpSelect } from './types';

const props = defineProps<{
  config: TmpSelect;
  model?: TmpFormModel;
  prop?: string;
  modelValue?: string;
}>();

const { triggerEvent, provideMethod } = useApp(props);

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const value = ref<string>(props.modelValue ?? props.config.defaultValue ?? '');

const items = ref<TmpItems>(props.config.items);

watch(
  () => value.value,
  () => {
    triggerEvent('change', { value: value.value });
    emits('update:modelValue', value.value);
  }
);

provideMethod('setValue', ({ newValue }: any) => (value.value = newValue), ['newValue']);

provideMethod('setItems', ({ newItems }: any) => (items.value = newItems), ['newItems']);

defineExpose({
  value,
  options: items,
  model: props.model,
  prop: props.prop,
});
</script>

<template>
  <VSelect v-model="value" :placeholder="config.placeholder" :items="items" :label="config.label" clearable> </VSelect>
</template>
