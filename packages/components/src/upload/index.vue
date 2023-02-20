<script lang="ts" setup>
import { useSelectFileUpload } from '@tmp/basic';
import { ElFormItem } from 'element-plus';

import { TmpUpload } from './type';

defineProps<{
  config: TmpUpload;
}>();

const { execute } = useSelectFileUpload((files: File[]) => {
  console.log('====', files);
});
const handleUploadClick = () => {
  execute();
};
</script>

<template>
  <ElFormItem :label="config.label" :prop="config.name">
    <div @click="handleUploadClick">upload</div>
  </ElFormItem>
</template>
