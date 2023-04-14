<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Context, Renderer } from '@tmp/3d-engine';
import { BoxGeometry, Matrix4, Mesh, MeshBasicMaterial } from 'three';

const containerRef = ref<HTMLDivElement>();

const context = new Context();
const box = new BoxGeometry(5, 5, 5);
const material = new MeshBasicMaterial({
  color: 'aquamarine',
});
const mesh = new Mesh(box, material);
const translationMatrix = new Matrix4().setPosition(5, 5, 5);
mesh.applyMatrix4(new Matrix4().multiply(translationMatrix));

context.addObject(mesh);

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.appendChild(context.domElement);
    Renderer.createRenderer(context);
  }
});
</script>

<template>
  <div ref="containerRef" class="content"></div>
</template>

<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
