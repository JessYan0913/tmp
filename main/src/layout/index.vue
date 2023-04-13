<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="layout">
    <div class="menu">
      <RouterLink to="/application">应用列表 </RouterLink>
      <RouterLink to="/application/setting">应用设置 </RouterLink>
      <RouterLink to="/webgl/01">webgl-01 </RouterLink>
      <RouterLink to="/three">three </RouterLink>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.layout {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.menu {
  background-color: rgba(137, 43, 226, 0.498);
  height: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
