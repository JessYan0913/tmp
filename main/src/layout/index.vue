<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme';

import Header from './Header.vue';
import Main from './Main.vue';
import Menu from './Menu.vue';

useTheme();
</script>

<template>
  <el-container class="layout">
    <el-aside width="200px">
      <Menu />
    </el-aside>
    <el-container>
      <el-header class="menu">
        <Header />
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
</style>
