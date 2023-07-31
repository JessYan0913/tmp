<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue';
import serialize from 'serialize-javascript';

import MIcon from '../../components/Icon.vue';

export default defineComponent({
  name: 'UiComponentPanel',

  components: { MIcon },

  setup() {
    const searchText = ref('');
    const collapseValue = ref('');
    const componentGroupList = inject<any>('componentGroupList');
    // const stageOptions = inject<StageOptions>('stageOptions');

    // const stage = computed(() => services?.editorService.get<StageCore>('stage'));
    const list = computed(() => {
      return componentGroupList.map((group: any) => ({
        ...group,
        items: group.items.filter((item: any) => item.text.includes(searchText.value)),
      }));
    });
    // const collapseValue = computed(() =>
    //   Array(list.value?.length)
    //     .fill(1)
    //     .map((x, i) => i)
    // );

    // let timeout: NodeJS.Timeout | undefined;
    // let clientX: number;
    // let clientY: number;any

    return {
      searchText,
      collapseValue,
      list,

      appendComponent({ text, type, data = {} }: any): void {
        console.log('appendComponent====', text, type, data);

        // services?.editorService.add({
        //   name: text,
        //   type,
        //   ...data,
        // });
      },

      dragstartHandler({ text, type, data = {} }: any, e: DragEvent) {
        // 拖动开始触发
        console.log('dragstartHandler====', text, type, data);
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData(
            'data',
            serialize({
              name: text,
              type,
              ...data,
            }).replace(/"(\w+)":\s/g, '$1: ')
          );
        }
      },

      dragendHandler() {
        // 拖动结束才触发
        console.log('dragendHandler====');
        // if (timeout) {
        //   globalThis.clearTimeout(timeout);
        //   timeout = undefined;
        // }
        // const doc = stage.value?.renderer.contentWindow?.document;
        // if (doc && stageOptions) {
        //   removeClassNameByClassName(doc, stageOptions.containerHighlightClassName);
        // }
        // clientX = 0;
        // clientY = 0;
      },

      dragHandler(e: DragEvent) {
        console.log('dragHandler====', e);
        // 拖动过程中一直触发
        // console.log('dragHandler====', e);
        // if (e.clientX !== clientX || e.clientY !== clientY) {
        //   clientX = e.clientX;
        //   clientY = e.clientY;
        //   if (timeout) {
        //     globalThis.clearTimeout(timeout);
        //     timeout = undefined;
        //   }
        //   return;
        // }
        // if (timeout || !stage.value) return;
        // timeout = stage.value.getAddContainerHighlightClassNameTimeout(e);
      },
    };
  },
});
</script>

<template>
  <el-scrollbar>
    <slot name="component-list-panel-header"></slot>

    <el-collapse class="ui-component-panel" :model-value="collapseValue">
      <el-input
        v-model="searchText"
        prefix-icon="el-icon-search"
        placeholder="输入关键字进行过滤"
        class="search-input"
        size="small"
        clearable
      />
      <template v-for="(group, index) in list">
        <el-collapse-item v-if="group.items && group.items.length" :key="index" :name="index">
          <template #title><i class="el-icon-s-grid"></i>{{ group.title }}</template>
          <div
            v-for="item in group.items"
            :key="item.type"
            class="component-item"
            draggable="true"
            @click="appendComponent(item)"
            @dragstart="dragstartHandler(item, $event)"
            @dragend="dragendHandler"
            @drag="dragHandler"
          >
            <MIcon :icon="item.icon"></MIcon>

            <el-tooltip effect="dark" placement="bottom" :content="item.text">
              <span>{{ item.text }}</span>
            </el-tooltip>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </el-scrollbar>
</template>
