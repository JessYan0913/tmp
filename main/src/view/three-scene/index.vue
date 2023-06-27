<script lang="ts" setup>
import { Context, LoaderPlugin } from '@tmp/3d-engine';

import useSelectFile from '@/hooks/useSelectFile';

import ThreeScene from './components/ThreeScene.vue';

const context = new Context();

const loader = new LoaderPlugin({ context });

const { execute: selectFileExecute } = useSelectFile();

const handleUpload = async () => {
  const files = await selectFileExecute(['.obj']);
  loader.loadFile(files[0]);
};
</script>

<template>
  <div class="content">
    <div class="menu">
      <el-button @click="handleUpload">上传</el-button>
    </div>
    <ThreeScene class="scene" :context="context" />
  </div>
</template>

<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.menu {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: start;
  align-items: center;
}

.scene {
  flex: 1;
}
</style>
