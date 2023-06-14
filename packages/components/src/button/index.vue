<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElButton } from 'element-plus';

import { useApp } from '../hooks/useApp';

import { TmpButton } from './types';

const props = defineProps<{
  config: TmpButton;
}>();

const { app, component } = useApp(props);

const disabled = ref<boolean>(props.config.disabled ?? false);

const text = computed<string>(() => {
  let result = '';
  if (props.config.disabled && props.config.disableText) {
    result = props.config.disableText;
  } else if (props.config.text) {
    result = props.config.text;
  }
  return result;
});

const handleClick = () => {
  app?.emit('click', { component });
};
</script>

<template>
  <ElButton :disabled="disabled" @click="handleClick">{{ text }}</ElButton>
</template>
