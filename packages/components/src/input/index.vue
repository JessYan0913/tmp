<script lang="ts" setup>
import { computed, ref } from 'vue';
import { ElFormItem, ElInput } from 'element-plus';

import { TmpInput } from './type';

const props = defineProps<{
  config: TmpInput;
}>();

const value = ref<string>();

const showWordLimit = computed<boolean>(() => Boolean(props.config.maxLength || props.config.minLength));

const inputType = computed<string>(() => (props.config.isPassword ? 'password' : 'text'));
</script>

<template>
  <ElFormItem :label="config.label" :prop="config.name">
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
  </ElFormItem>
</template>