<script setup lang="ts">
import { defineComponent } from 'vue';

// 组件逻辑和方法

defineComponent({
  // 组件选项
});
</script>

<template>
  <div class="container">
    <header class="header">Header</header>
    <aside class="left sidebar">Sidebar</aside>
    <main class="main">Main Content</main>
    <aside class="right sidebar">Sidebar</aside>
    <footer class="footer">Footer</footer>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-areas:
    'header header header'
    'sidebar-left main sidebar-right'
    'sidebar-left footer footer';
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto 1fr auto;
  min-height: 100vh;
}

.header {
  grid-area: header;
  background-color: #f0f0f0;
  height: 50px;
  padding: 10px;
}

.footer {
  grid-area: footer;
  background-color: #f0f0f0;
  height: 100px;
  padding: 10px;
}

.main {
  grid-area: main;
  padding: 10px;
}

.sidebar {
  background-color: #f8f8f8;
  padding: 10px;
}

.left {
  grid-area: sidebar-left;
  width: 280px;
}

.right {
  grid-area: sidebar-right;
  width: 280px;
}
</style>
