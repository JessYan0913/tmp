<script lang="ts" setup>
import { computed } from 'vue';
import { TmpFormModel } from '@tmp/h5-schema';
import { ElInput } from 'element-plus';

import { TmpInput } from './types';

const props = defineProps<{
  config: TmpInput;
  model: TmpFormModel;
  prop?: string;
}>();

// const value = ref<string>(props.config.defaultValue ?? '');

const name = computed<string>(() => props.config.name ?? '');

const showWordLimit = computed<boolean>(() => Boolean(props.config.maxLength || props.config.minLength));

const inputType = computed<string>(() => (props.config.isPassword ? 'password' : 'text'));
</script>

<template>
  <ElInput
    v-model="model[name]"
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
