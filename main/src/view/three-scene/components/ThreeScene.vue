<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Context, Renderer } from '@tmp/3d-engine';

const props = defineProps<{
  context: Context;
}>();

const containerRef = ref<HTMLDivElement>();

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.appendChild(props.context.domElement);
    Renderer.createRenderer(props.context);
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
