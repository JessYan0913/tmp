<script setup lang="ts">
import { ref } from 'vue';

const resizableRef = ref<HTMLDivElement>();
const resizeWidth = ref<number>(200);
const resizeHeight = ref<number>(200);

let initialX: number = 0;
let initialY: number = 0;
let initialWidth: number = 0;
let initialHeight: number = 0;

const handleStartResize = (event: MouseEvent) => {
  event.preventDefault();

  initialX = event.clientX;
  initialY = event.clientY;
  initialWidth = resizableRef.value?.offsetWidth ?? 0;
  initialHeight = resizableRef.value?.offsetHeight ?? 0;

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', handleStopResize);
};

const handleResize = (event: MouseEvent) => {
  event.preventDefault();

  const deltaX = event.clientX - initialX;
  const deltaY = event.clientY - initialY;

  resizeWidth.value = initialWidth + deltaX;
  resizeHeight.value = initialHeight + deltaY;
};

const handleStopResize = () => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', handleStopResize);
};

document.addEventListener('mousedown', handleStartResize);
</script>

<template>
  <div>
    <h1>Resizable</h1>
    <div ref="resizableRef" class="content"></div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: calc(v-bind(resizeWidth) * 1px);
  height: calc(v-bind(resizeHeight) * 1px);
  background-color: rgb(132, 193, 196);
}
</style>
