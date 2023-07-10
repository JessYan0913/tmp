<script lang="ts" setup>
import { computed } from 'vue';
import { TmpElement, TmpFormModel } from '@tmp/schema';

const props = withDefaults(
  defineProps<{
    config: TmpElement;
    model?: TmpFormModel;
    prop?: string;
  }>(),
  {
    prop: '',
  }
);
const tagName = computed<string>(() => `tmp-ui-${props.config.type}`);
</script>

<template>
  <component :id="config.id" :is="tagName" :config="config" :model="model" :prop="prop"></component>
</template>
