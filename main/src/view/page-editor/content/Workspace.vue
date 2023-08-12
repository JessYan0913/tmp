<script lang="ts" setup>
// import { computed, inject } from 'vue';

// import { MenuButton, MenuComponent, Services } from '@editor/type';

// import Breadcrumb from './Breadcrumb.vue';
// import PageBar from './PageBar.vue';
import MagicStage from './Stage.vue';

// defineOptions({
//   name: 'MEditorWorkspace',
// });

// defineProps<{
//   stageContentMenu?: any[];
// }>();

// const services = inject<Services>('services');

// const page = computed(() => services?.editorService.get('page'));
</script>

<template>
  <div class="m-editor-workspace">
    <!-- <Breadcrumb></Breadcrumb> -->

    <slot name="stage">
      <MagicStage></MagicStage>
    </slot>

    <slot name="workspace-content"></slot>

    <!-- <PageBar>
      <template #page-bar-title="{ page }"><slot name="page-bar-title" :page="page"></slot></template>
      <template #page-bar-popover="{ page }"><slot name="page-bar-popover" :page="page"></slot></template>
    </PageBar> -->
  </div>
</template>

<style lang="scss" scoped>
.m-editor-workspace {
  height: 100%;
  width: 100%;
  user-select: none;
  outline: none;
  position: relative;
}
</style>
