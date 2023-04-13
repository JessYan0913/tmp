<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Context, Renderer } from '@tmp/3d-engine';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

const containerRef = ref<HTMLDivElement>();

const box = new BoxGeometry(5, 5, 5);
const material = new MeshBasicMaterial({
  color: 'aqua',
});
const mesh = new Mesh(box, material);

watch(
  () => containerRef.value,
  (containerRef) => {
    if (!containerRef) {
      return;
    }
    const context = new Context(containerRef);
    context.addObject(mesh);
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
