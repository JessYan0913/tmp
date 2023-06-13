<script setup lang="ts">
import { defineComponent } from 'vue';

// 组件逻辑和方法

defineComponent({
  // 组件选项
});
</script>

<template>
  <div class="container">
    <div class="tools">工具栏</div>
    <div class="tool-panel">工具区</div>
    <div class="vertical-divider"></div>
    <div class="content">
      <div class="main">
        <div class="header">Header</div>
        <div class="main">Main</div>
        <div class="sidebar">Sidebar</div>
      </div>
      <div class="horizontal-divider"></div>
      <div class="footer">Footer</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  min-height: 100vh;
}
.tools {
  width: 55px;
  background-color: #f0f0f0;
}
.tool-panel {
  width: 280px;
  background-color: #d1d1d1;
}
.vertical-divider {
  width: 1px;
  min-height: 1vh;
  cursor: col-resize;

  &:hover {
    width: 3px;
    background-color: rgb(45, 45, 211);
  }
}
.horizontal-divider {
  min-width: 100%;
  height: 1px;
  cursor: row-resize;

  &:hover {
    height: 3px;
    background-color: rgb(45, 45, 211);
  }
}
.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main {
  flex-grow: 1;
  display: grid;
  grid-template-areas:
    'header header'
    'main sidebar';
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
}
.header {
  height: 85px;
  grid-area: header;
  background-color: #f0f0f0;
}
.main {
  grid-area: main;
  background-color: #b1b1b1;
}
.sidebar {
  width: 126px;
  grid-area: sidebar;
  background-color: #c4c4c4;
}
.footer {
  height: 280px;
  background-color: #b1b1b1;
}
</style>
