<script lang="ts" setup>
import { getFileExtension, selectFile } from '@tmp/utils';

console.log(getFileExtension('ddsdsd.txt'));
const handleSelectFile = async () => {
  try {
    const files = await selectFile(['.png']);
    console.log('====', files);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div>
    <h1>应用列表</h1>
    <button @click="handleSelectFile">选择文件</button>
  </div>
</template>
