<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div>
    <div class="menu">
      <RouterLink to="/application">应用列表 </RouterLink>
      <RouterLink to="/application/setting">应用设置 </RouterLink>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.menu {
  background-color: rgba(137, 43, 226, 0.498);
  height: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
