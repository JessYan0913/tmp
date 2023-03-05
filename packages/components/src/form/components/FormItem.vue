<script setup lang="ts">
import { computed } from 'vue';
import { TmpFormItemElement, TmpFormModel } from '@tmp/h5-schema';
import { ElFormItem } from 'element-plus';

import TmpUiComponent from '../../Component.vue';

const props = withDefaults(
  defineProps<{
    config: TmpFormItemElement;
    model: TmpFormModel;
    prop?: string;
  }>(),
  {
    prop: '',
  }
);

const name = computed<string>(() => props.config.name ?? '');

const itemProp = computed<string>(() => {
  let result: string | number = '';
  const { names } = props.config as any;
  if (names?.[0]) {
    [result] = names;
  } else if (name.value) {
    result = name.value;
  } else {
    return props.prop;
  }
  return `${props.prop}${props.prop ? '.' : ''}${result}`;
});
</script>

<template>
  <ElFormItem :label="config.label" :prop="itemProp">
    <TmpUiComponent v-model="model[itemProp]" :config="config" :model="model" :prop="itemProp"></TmpUiComponent>
  </ElFormItem>
</template>
