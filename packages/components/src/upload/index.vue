<script lang="ts" setup>
import { ElFormItem } from 'element-plus';

import { TmpUpload } from './type';

defineProps<{
  config: TmpUpload;
}>();
</script>

<template>
  <ElFormItem :label="config.label" :prop="config.name">
    <div>upload</div>
  </ElFormItem>
</template>
