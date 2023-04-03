<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Context, Renderer } from '@tmp/3d-engine';

const containerRef = ref<HTMLDivElement>();

watch(
  () => containerRef.value,
  (containerRef) => {
    if (!containerRef) {
      return;
    }
    const context = new Context(containerRef);
    Renderer.createRenderer(context);
  }
);
</script>

<template>
  <div ref="containerRef" class="content"></div>
</template>

<style lang="scss" scoped>
.content {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
