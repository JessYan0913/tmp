<script lang="ts" setup>
import { computed } from 'vue';
import { TmpElement } from '@tmp/h5-schema';
import { ElFormItem } from 'element-plus';

const props = defineProps<{
  config: TmpElement;
}>();

const tagName = computed<string>(() => `tmp-ui-${props.config.type}`);

const isFormItem = computed<boolean>(() => ['input', 'select', 'upload'].includes(props.config.type));
</script>

<template>
  <ElFormItem v-if="isFormItem" :label="config.label" :prop="config.name">
    <component :id="config.id" :is="tagName" :config="config"></component>
  </ElFormItem>
  <component v-else :id="config.id" :is="tagName" :config="config"></component>
</template>
