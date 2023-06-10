<script lang="ts" setup>
import { RouterLink } from 'vue-router';

import { useTheme } from '@/hooks/useTheme';

import Main from './Main.vue';

useTheme();
</script>

<template>
  <el-container class="layout">
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header class="menu">
        <RouterLink to="/page-A"> 页面A </RouterLink>
        <RouterLink to="/page-B"> 页面B </RouterLink>
        <RouterLink to="/page-C"> 页面C </RouterLink>
        <RouterLink to="/three">three </RouterLink>
      </el-header>
      <el-main class="section">
        <Main />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
}
.menu {
  background-color: var(--menu-bg-color);
  height: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  & a {
    color: #fff;
  }
}
.section {
  height: 100%;
  overflow: auto;
}
</style>
