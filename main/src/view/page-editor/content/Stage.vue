<script lang="ts">
import { defineComponent, reactive, ref, watchEffect } from 'vue';
// import { cloneDeep } from 'lodash-es';
// import type { MApp, MContainer, MNode, MPage } from '@tmagic/schema';
import StageCore, { Runtime } from '@tmp/stage';
// import ScrollViewer from '@editor/components/ScrollViewer.vue';

// import {
//   H_GUIDE_LINE_STORAGE_KEY,
//   Layout,
//   Services,
//   StageOptions,
//   StageRect,
//   V_GUIDE_LINE_STORAGE_KEY,
// } from '@editor/type';
// import { getGuideLineFromCache } from '@editor/utils';
// import ViewerMenu from './ViewerMenu.vue';

export default defineComponent({
  name: 'MagicStage',

  components: {
    // ViewerMenu,
    // ScrollViewer,
  },

  setup() {
    /**
     * todo：实例化舞台，内部主要之一是创建 iframe，并在其window上增加相应方法提供给 runtime ，
     * 用于 runtime 把 runtimeHandler 传给 editor(编辑器通过 runtimeHandler 改变画布展示内容)
     *
     * 外层组件引入画布：
     *  左侧面板 --- stage.vue dropHandler --- editorService.add --- stageCore.add --- runtime?.add
     * 操作画布中组件：
     *  蒙版层（StageCore） --- stage.vue --- service --- runtime --- core.emit
     *
     */

    // const services = inject<Services>('services');
    // const stageOptions = inject<StageOptions>('stageOptions');

    const stageWrap = ref<any>();
    const stageContainer = ref<HTMLDivElement>();
    // const menu = ref<InstanceType<typeof ViewerMenu>>();

    // const stageRect = computed(() => services?.uiService.get<StageRect>('stageRect'));
    const stageRect = reactive({ width: 500, height: 500 });
    // const uiSelectMode = computed(() => services?.uiService.get<boolean>('uiSelectMode'));
    // const root = computed(() => services?.editorService.get<MApp>('root'));
    // const page = computed(() => services?.editorService.get<MPage>('page'));
    // const zoom = computed(() => services?.uiService.get<number>('zoom') || 1);
    const zoom = ref(1);
    // const node = computed(() => services?.editorService.get<MNode>('node'));
    let stage: StageCore | null = null;
    let runtime: Runtime | null = null;
    watchEffect(() => {
      if (stage) return;

      if (!stageContainer.value) return;

      stage = new StageCore({
        runtimeUrl: '/tmp/playground/runtime/html/index.html',
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

    // const getGuideLineKey = (key: string) => `${key}_${root.value?.id}_${page.value?.id}`;

    // watchEffect(() => {
    //   if (stage) return;

    //   if (!stageContainer.value) return;
    //   if (!(stageOptions?.runtimeUrl || stageOptions?.render) || !root.value) return;

    //   stage = new StageCore({
    //     render: stageOptions.render,
    //     runtimeUrl: stageOptions.runtimeUrl,
    //     zoom: zoom.value,
    //     autoScrollIntoView: stageOptions.autoScrollIntoView,
    //     isContainer: stageOptions.isContainer,
    //     containerHighlightClassName: stageOptions.containerHighlightClassName,
    //     containerHighlightDuration: stageOptions.containerHighlightDuration,
    //     canSelect: (el, event, stop) => {
    //       const elCanSelect = stageOptions.canSelect(el);
    //       // 在组件联动过程中不能再往下选择，返回并触发 ui-select
    //       if (uiSelectMode.value && elCanSelect && event.type === 'mousedown') {
    //         document.dispatchEvent(new CustomEvent('ui-select', { detail: el }));
    //         return stop();
    //       }

    //       return elCanSelect;
    //     },
    //     moveableOptions: stageOptions.moveableOptions,
    //     updateDragEl: stageOptions.updateDragEl,
    //   });

    //   services?.editorService.set('stage', markRaw(stage));

    //   stage?.mount(stageContainer.value);

    //   stage.mask.setGuides([
    //     getGuideLineFromCache(getGuideLineKey(H_GUIDE_LINE_STORAGE_KEY)),
    //     getGuideLineFromCache(getGuideLineKey(V_GUIDE_LINE_STORAGE_KEY)),
    //   ]);

    //   stage?.on('select', (el: HTMLElement) => {
    //     services?.editorService.select(el.id);
    //   });

    //   stage?.on('highlight', (el: HTMLElement) => {
    //     services?.editorService.highlight(el.id);
    //   });

    //   stage?.on('update', (ev: UpdateEventData) => {
    //     if (ev.parentEl) {
    //       services?.editorService.moveToContainer({ id: ev.el.id, style: ev.style }, ev.parentEl.id);
    //       return;
    //     }
    //     services?.editorService.update({ id: ev.el.id, style: ev.style });
    //   });

    //   stage?.on('sort', (ev: SortEventData) => {
    //     services?.editorService.sort(ev.src, ev.dist);
    //   });

    //   stage?.on('changeGuides', (e) => {
    //     services?.uiService.set('showGuides', true);

    //     if (!root.value || !page.value) return;

    //     const storageKey = getGuideLineKey(
    //       e.type === GuidesType.HORIZONTAL ? H_GUIDE_LINE_STORAGE_KEY : V_GUIDE_LINE_STORAGE_KEY
    //     );
    //     if (e.guides.length) {
    //       globalThis.localStorage.setItem(storageKey, JSON.stringify(e.guides));
    //     } else {
    //       globalThis.localStorage.removeItem(storageKey);
    //     }
    //   });

    //   if (!node.value?.id) return;
    //   stage?.on('runtime-ready', (rt) => {
    //     runtime = rt;
    //     // toRaw返回的值是一个引用而非快照，需要cloneDeep
    //     root.value && runtime?.updateRootConfig?.(cloneDeep(toRaw(root.value)));
    //     page.value?.id && runtime?.updatePageId?.(page.value.id);
    //     setTimeout(() => {
    //       node.value && stage?.select(toRaw(node.value.id));
    //     });
    //   });
    // });

    // 监听 service 层响应式数据

    // watch(zoom, (zoom) => {
    //   if (!stage || !zoom) return;
    //   stage.setZoom(zoom);
    // });

    // watch(root, (root) => {
    //   if (runtime && root) {
    //     runtime.updateRootConfig?.(cloneDeep(toRaw(root)));
    //   }
    // });

    // 监听 dom 变化，改变画布舞台

    // const resizeObserver = new ResizeObserver((entries) => {
    //   for (const { contentRect } of entries) {
    //     services?.uiService.set('stageContainerRect', {
    //       width: contentRect.width,
    //       height: contentRect.height,
    //     });
    //   }
    // });

    // onMounted(() => {
    //   stageWrap.value?.container && resizeObserver.observe(stageWrap.value.container);
    // });

    // onUnmounted(() => {
    //   stage?.destroy();
    //   resizeObserver.disconnect();
    //   services?.editorService.set('stage', null);
    // });

    return {
      stageWrap,
      stageContainer,
      // menu,
      stageRect,
      zoom,
      // 右键操作，展示UI
      contextmenuHandler(e: MouseEvent) {
        e.preventDefault();
        // menu.value?.show(e);
      },
      // 在舞台上部移动
      dragoverHandler(e: DragEvent) {
        console.log('stage dragoverHandler====', e);
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }
      },
      // 拖入画布舞台
      async dropHandler(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer && parent && stageContainer.value) {
          // eslint-disable-next-line no-eval
          const config = eval(`(${e.dataTransfer.getData('data')})`);
          console.log('stage dropHandler config===', config);
        }
        // const doc = stage?.renderer.contentWindow?.document;
        // const parentEl: HTMLElement | null | undefined = doc?.querySelector(
        //   `.${stageOptions?.containerHighlightClassName}`
        // );

        // let parent: MContainer | undefined = page.value;
        // if (parentEl) {
        //   parent = services?.editorService.getNodeById(parentEl.id, false) as MContainer;
        // }

        // if (e.dataTransfer && parent && stageContainer.value && stage) {
        //   // eslint-disable-next-line no-eval
        //   const config = eval(`(${e.dataTransfer.getData('data')})`);
        //   const layout = await services?.editorService.getLayout(parent);

        //   const containerRect = stageContainer.value.getBoundingClientRect();
        //   const { scrollTop, scrollLeft } = stage.mask;
        //   const { style = {} } = config;

        //   let top = 0;
        //   let left = 0;
        //   let position = 'relative';

        //   if (layout === Layout.ABSOLUTE) {
        //     position = 'absolute';
        //     top = e.clientY - containerRect.top + scrollTop;
        //     left = e.clientX - containerRect.left + scrollLeft;

        //     if (parentEl && doc) {
        //       const { left: parentLeft, top: parentTop } = getOffset(parentEl);
        //       left = left - calcValueByFontsize(doc, parentLeft);
        //       top = top - calcValueByFontsize(doc, parentTop);
        //     }
        //   }

        //   config.style = {
        //     ...style,
        //     position,
        //     top,
        //     left,
        //   };

        //   config.inputEvent = e;

        //   services?.editorService.add(config, parent);
        // }
      },
    };
  },
});
</script>

<template>
  <!-- 负责舞台视图缩放 -->
  <!-- <ScrollViewer
    ref="stageWrap"
    class="m-editor-stage"
    :width="stageRect?.width"
    :height="stageRect?.height"
    :zoom="zoom"
  > -->
  <div
    ref="stageContainer"
    class="m-editor-stage-container"
    :style="`transform: scale(${zoom})`"
    @contextmenu="contextmenuHandler"
    @drop="dropHandler"
    @dragover="dragoverHandler"
  ></div>
  <!-- <teleport to="body">
      <ViewerMenu ref="menu"></ViewerMenu>
    </teleport> -->
  <!-- </ScrollViewer> -->
</template>

<style lang="scss" scoped>
.m-editor-stage-container {
  height: 100%;
  width: 100%;
  user-select: none;
}
</style>
