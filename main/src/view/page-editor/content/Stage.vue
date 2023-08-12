<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
// import { cloneDeep } from 'lodash-es';
// import type { MContainer } from '@tmagic/schema';
import StageCore, { Runtime } from '@tmp/stage';

import ScrollViewer from '../components/ScrollViewer.vue';
// import { Layout, MenuButton, MenuComponent, Services, StageOptions } from '@editor/type';
// import { getConfig } from '@editor/utils/config';
// import { useStage } from '@editor/utils/stage';

// import ViewerMenu from './ViewerMenu.vue';

// defineOptions({
//   name: 'MEditorStage',
// });

// defineProps<{
//   stageContentMenu: (MenuButton | MenuComponent)[];
// }>();

let stage: StageCore | null = null;
let runtime: Runtime | null = null;

const stageWrap = ref<InstanceType<typeof ScrollViewer>>();
const stageContainer = ref<HTMLDivElement>();

const stageRect = reactive({ width: 375, height: 817 });
const stageContainerRect = reactive({
  width: 0,
  height: 0,
});
// const root = computed(() => services?.editorService.get('root'));
// const page = computed(() => services?.editorService.get('page'));
const zoom = ref(1);
// const zoom = computed(() => services?.uiService.get('zoom') || 1);
// const node = computed(() => services?.editorService.get('node'));

watchEffect(() => {
  if (stage) return;

  if (!stageContainer.value) return;

  stage = new StageCore({
    runtimeUrl: '/tmp/playground/runtime/html/index.html',
    zoom: zoom.value,
  });
  console.log('stage===', stage);
  stage?.mount(stageContainer.value);
  stage?.on('runtime-ready', (rt) => {
    runtime = rt;
    // // toRaw返回的值是一个引用而非快照，需要cloneDeep
    // root.value && runtime?.updateRootConfig?.(cloneDeep(toRaw(root.value)));
    // page.value?.id && runtime?.updatePageId?.(page.value.id);
    runtime?.updatePageId?.('1');
    // setTimeout(() => {
    //   node.value && stage?.select(toRaw(node.value.id));
    // });
  });
});

watch(zoom, (zoom) => {
  if (!stage || !zoom) return;
  stage.setZoom(zoom);
});

// watch(root, (root) => {
//   if (runtime && root) {
//     runtime.updateRootConfig?.(cloneDeep(toRaw(root)));
//   }
// });

// watch(page, (page) => {
//   if (runtime && page) {
//     runtime.updatePageId?.(page.id);
//     nextTick(() => {
//       stage?.select(page.id);
//     });
//   }
// });

const resizeObserver = new ResizeObserver((entries) => {
  for (const { contentRect } of entries) {
    stageContainerRect.width = contentRect.width;
    stageContainerRect.height = contentRect.height;
    // services?.uiService.set('stageContainerRect', {
    //   width: contentRect.width,
    //   height: contentRect.height,
    // });
  }
});

onMounted(() => {
  if (stageWrap.value?.container) {
    resizeObserver.observe(stageWrap.value.container);
    // services?.keybindingService.registeEl('stage', stageWrap.value.container);
  }
});

onUnmounted(() => {
  stage?.destroy();
  resizeObserver.disconnect();
  // services?.editorService.set('stage', null);
  // services?.keybindingService.unregisteEl('stage');
});

const contextmenuHandler = (e: MouseEvent) => {
  e.preventDefault();
  // menu.value?.show(e);
};

const dragoverHandler = (e: DragEvent) => {
  console.log('stage dragoverHandler====', e);
  e.preventDefault();
  if (!e.dataTransfer) return;
  e.dataTransfer.dropEffect = 'move';
};

const dropHandler = async (e: DragEvent) => {
  e.preventDefault();

  // const doc = stage?.renderer.contentWindow?.document;
  // const parentEl: HTMLElement | null | undefined = doc?.querySelector(`.${stageOptions?.containerHighlightClassName}`);

  // let parent: MContainer | undefined | null = page.value;
  // if (parentEl) {
  //   parent = services?.editorService.getNodeById(parentEl.id, false) as MContainer;
  // }

  if (e.dataTransfer && stageContainer.value && stage) {
    // if (e.dataTransfer && parent && stageContainer.value && stage) {
    const config = eval(`(${e.dataTransfer.getData('data')})`);
    console.log('stage dropHandler config===', config);
  }
};
const addZoom = () => {
  zoom.value = zoom.value + 0.1;
  stage?.setZoom(zoom.value);
};
const splZoom = () => {
  zoom.value = zoom.value - 0.1;
  stage?.setZoom(zoom.value);
};
const select = () => {
  stage?.select('warningId');
};
</script>

<template>
  <ScrollViewer
    ref="stageWrap"
    class="m-editor-stage"
    tabindex="-1"
    :width="stageRect?.width"
    :height="stageRect?.height"
    :wrap-width="stageContainerRect?.width"
    :wrap-height="stageContainerRect?.height"
    :zoom="zoom"
    :correction-scroll-size="{
      width: 60,
      height: 50,
    }"
    @click="stageWrap?.container?.focus()"
  >
    <template #other>
      <div class="operate-wrap">
        <el-button @click="addZoom">+</el-button>
        <el-button @click="splZoom">-</el-button>
        <el-button @click="select">select</el-button>
      </div>
    </template>
    <div
      ref="stageContainer"
      class="m-editor-stage-container"
      @contextmenu="contextmenuHandler"
      @drop="dropHandler"
      @dragover="dragoverHandler"
    ></div>
    <!-- <Teleport to="body">
      <ViewerMenu ref="menu" :is-multi-select="isMultiSelect" :stage-content-menu="stageContentMenu"></ViewerMenu>
    </Teleport> -->
  </ScrollViewer>
</template>

<style lang="scss" scoped>
.operate-wrap {
  position: absolute;
  // z-index: 99;
  left: 0;
  top: 0;
}
</style>
