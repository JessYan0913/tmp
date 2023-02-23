<script lang="ts" setup>
import { ref } from 'vue';
import { ElOption, ElSelect } from 'element-plus';

import { TmpSelect } from './type';

defineProps<{
  config: TmpSelect;
}>();

const value = ref<string>();
</script>

<template>
  <ElSelect v-model="value" :placeholder="config.placeholder" :clearable="config.clearable">
    <ElOption v-for="({ label, value }, index) in config.options" :key="index" :label="label" :value="value">
      {{ label }}
    </ElOption>
  </ElSelect>
</template>
