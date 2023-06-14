<script setup lang="ts">
import { ref, watch } from 'vue';

import { useApp } from '../hooks/useApp';

import { TmpText } from './types';

const props = defineProps<{
  config: TmpText;
}>();

const { triggerEvent, provideMethod } = useApp(props);

const text = ref<string>(props.config.text ?? '');

watch(
  () => text.value,
  () => triggerEvent('change', { text: text.value })
);

provideMethod('setText', ({ newText }: any) => (text.value = newText), ['newText']);

defineExpose({
  text,
});
</script>

<template>
  <div>{{ text }}</div>
</template>
