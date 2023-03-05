<script lang="ts" setup>
import { computed } from 'vue';
import { TmpFormModel } from '@tmp/h5-schema';
import { ElInput } from 'element-plus';

import { TmpInput } from './types';

const props = defineProps<{
  config: TmpInput;
  model?: TmpFormModel;
  prop?: string;
  modelValue?: string;
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const value = computed<string>({
  set(value: string) {
    emits('update:modelValue', value);
  },
  get(): string {
    return props.modelValue ?? props.config.defaultValue ?? '';
  },
});

const showWordLimit = computed<boolean>(() => Boolean(props.config.maxLength || props.config.minLength));

const inputType = computed<string>(() => (props.config.isPassword ? 'password' : 'text'));
</script>

<template>
  <ElInput
    v-model="value"
    :placeholder="config.placeholder"
    :clearable="config.clearable"
    :maxlength="config.maxLength"
    :minlength="config.minLength"
    :show-word-limit="showWordLimit"
    :type="inputType"
  >
    <template #prepend v-if="config.prepend"> {{ config.prepend }} </template>
    <template #append v-if="config.append"> {{ config.append }} </template>
  </ElInput>
</template>
