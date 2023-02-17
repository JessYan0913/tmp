<script lang="ts" setup>
import { computed } from 'vue';
import { TmpElement } from '@tmp/h5-schema';

const props = defineProps<{
  config: TmpElement;
}>();

const tagName = computed<string>(() => `tmp-ui-${props.config.type}`);
</script>

<template>
  <component :id="config.id" :is="tagName" :config="config"></component>
</template>
