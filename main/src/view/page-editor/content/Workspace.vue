<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';

// import KeyController from 'keycon';
// import type { MNode, MPage } from '@tmagic/schema';
// import { isPage } from '@tmagic/utils';
// import type { Services } from '@editor/type';
// import PageBar from './PageBar.vue';
import MagicStage from './Stage.vue';

export default defineComponent({
  name: 'MEditorWorkspace',

  components: {
    // PageBar,
    MagicStage,
  },

  setup() {
    // const services = inject<Services>('services');
    const workspace = ref<HTMLDivElement>();
    // const node = computed(() => services?.editorService.get<MNode>('node'));
    // let keycon: KeyController;

    const mouseenterHandler = () => {
      workspace.value?.focus();
    };

    const mouseleaveHandler = () => {
      workspace.value?.blur();
    };

    onMounted(() => {
      workspace.value?.addEventListener('mouseenter', mouseenterHandler);
      workspace.value?.addEventListener('mouseleave', mouseleaveHandler);
      // 快捷键
      // keycon = new KeyController(workspace.value);
    });

    onUnmounted(() => {
      workspace.value?.removeEventListener('mouseenter', mouseenterHandler);
      workspace.value?.removeEventListener('mouseleave', mouseleaveHandler);
      // keycon.destroy();
    });

    return {
      workspace,

      // page: computed(() => services?.editorService.get<MPage>('page')),
      page: computed(() => ({})),
    };
  },
});
</script>

<template>
  <div ref="workspace" class="m-editor-workspace" tabindex="1">
    <MagicStage :key="page?.id"></MagicStage>

    <slot name="workspace-content"></slot>

    <!-- 用于切换 workspace 中不同的 page -->
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
}
</style>
