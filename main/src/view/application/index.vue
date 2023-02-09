<script lang="ts" setup>
import { FileSelectCancelError, getFileExtension, IllegalFileError, selectFile } from '@tmp/utils';

console.log(getFileExtension('ddsdsd.txt'));
const handleSelectFile = async () => {
  try {
    const files = await selectFile(['.png']);
    console.log('====', files);
  } catch (error) {
    if (error instanceof FileSelectCancelError) {
      console.log('取消选择');
    } else if (error instanceof IllegalFileError) {
      console.log('文件格式不匹配', error.accepts);
    }
  }
};
</script>

<template>
  <div>
    <h1>应用列表</h1>
    <button @click="handleSelectFile">选择文件</button>
  </div>
</template>
