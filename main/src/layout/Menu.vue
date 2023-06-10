<script setup lang="ts">
import { useMenuList } from '@/hooks/useMenuList';

const menuList = useMenuList();
</script>

<template>
  <el-menu mode="vertical">
    <template v-for="menu in menuList">
      <el-sub-menu v-if="menu.children" :key="menu.index" :index="menu.index">
        <template #title>{{ menu.title }}</template>
        <el-menu-item v-for="childMenu in menu.children" :key="childMenu.index" :index="childMenu.index">
          {{ childMenu.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :key="`${menu.index}-false`" :index="menu.index">
        {{ menu.title }}
      </el-menu-item>
    </template>
  </el-menu>
</template>
