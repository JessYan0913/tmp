<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useTheme } from '@/hooks/useTheme';
import { useRoutersStore } from '@/store/routers';

useTheme();

const routerStore = useRoutersStore();

const { keepAliveComps } = storeToRefs(routerStore);
</script>

<template>
  <div class="layout">
    <header class="menu">
      <RouterLink to="/page-A"> 页面A </RouterLink>
      <RouterLink to="/page-B"> 页面B </RouterLink>
      <RouterLink to="/page-C"> 页面C </RouterLink>
      <RouterLink to="/three">three </RouterLink>
    </header>
    <section class="section">
      <RouterView v-slot="{ Component }">
        <KeepAlive :include="keepAliveComps">
          <component :is="Component"></component>
        </KeepAlive>
      </RouterView>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
}
</style>
