<script lang="ts" setup>
import { computed } from 'vue';
import { TmpElement, TmpFormModel } from '@tmp/h5-schema';
import { ElFormItem } from 'element-plus';

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

const name = computed<string>(() => props.config.name ?? '');

const tagName = computed<string>(() => `tmp-ui-${props.config.type}`);

const isFormItem = computed<boolean>(() => ['input', 'select', 'upload'].includes(props.config.type));

const itemProp = computed<string>(() => {
  let n: string | number = '';
  const { names } = props.config as any;
  if (names?.[0]) {
    [n] = names;
  } else if (name.value) {
    n = name.value;
  } else {
    return props.prop;
  }
  return `${props.prop}${props.prop ? '.' : ''}${n}`;
});
</script>

<template>
  <ElFormItem v-if="isFormItem" :label="config.label" :prop="itemProp">
    <component :id="config.id" :is="tagName" :config="config" :model="model" :prop="prop"></component>
  </ElFormItem>
  <component v-else :id="config.id" :is="tagName" :config="config"></component>
</template>
