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
  background-color: blueviolet;
}
</style>
