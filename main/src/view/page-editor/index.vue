<script setup lang="ts">
import { provide } from 'vue';

// todo：左侧展示组件物料，后期通过命令收集所有支持组件在指定目录生成文件
import componentGroupList from './configs/componentGroupList';
import Workspace from './content/Workspace.vue';
import leftSideBar from './left-sidebar/index.vue';

provide('componentGroupList', componentGroupList);
</script>

<template>
  <div class="container">
    <div class="header">Header</div>
    <div class="left-sidebar"><leftSideBar></leftSideBar></div>
    <div class="content"><Workspace></Workspace></div>
    <div class="right-sidebar">Sidebar</div>
    <div class="functional">Functional</div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'header header header'
    'left-sidebar content right-sidebar'
    'left-sidebar functional right-sidebar';
  min-height: 100%;
}
.header {
  grid-area: header;
  background-color: #dbdbdb;
}
.left-sidebar {
  grid-area: left-sidebar;
  background-color: #707070;
}
.right-sidebar {
  grid-area: right-sidebar;
  background-color: #707070;
}
.content {
  grid-area: content;
  background-color: #cccccc;
}
.functional {
  grid-area: functional;
  background-color: #a5a5a5;
}
</style>
