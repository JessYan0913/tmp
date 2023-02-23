<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ElInput } from 'element-plus';

import { TmpInput } from './type';

const props = defineProps<{
  config: TmpInput;
}>();

const value = ref<string>(props.config.defaultValue ?? '');

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
