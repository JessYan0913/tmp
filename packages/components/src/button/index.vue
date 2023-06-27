<script setup lang="ts">
import { computed, ref } from 'vue';
import { VBtn } from 'vuetify/components/VBtn';

import { useApp } from '../hooks/useApp';

import { TmpButton } from './types';

const props = defineProps<{
  config: TmpButton;
}>();

const { triggerEvent } = useApp(props);

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
  triggerEvent('click');
};

defineExpose({
  text,
  disabled,
});
</script>

<template>
  <VBtn :disabled="disabled" @click="handleClick">{{ text }}</VBtn>
</template>
