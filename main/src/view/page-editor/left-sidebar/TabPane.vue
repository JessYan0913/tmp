<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { Coin, Files } from '@element-plus/icons-vue';

import MIcon from '../../components/Icon.vue';

// import { SideComponent, SideItem } from '@editor/type';
import ComponentListPanel from './ComponentListPanel.vue';
// import LayerPanel from './LayerPanel.vue';

export default defineComponent({
  components: { MIcon },

  props: {
    data: {
      type: [Object, String] as PropType<any>,
    },
  },

  setup(props) {
    return {
      config: computed<any | undefined>(() => {
        // 自定义
        if (typeof props.data !== 'string') {
          return props.data;
        }
        // 默认情况
        switch (props.data) {
          case 'component-list':
            return {
              type: 'component',
              icon: Coin,
              text: '组件',
              component: ComponentListPanel,
              slots: {},
            };
          case 'layer':
            return {
              type: 'component',
              icon: Files,
              text: '已选组件',
              component: {},
              slots: {},
            };
          default:
            return undefined;
        }
      }),
    };
  },
});
</script>

<template>
  <el-tab-pane v-if="config" :name="config.text">
    <template #label>
      <div :key="config.text">
        <MIcon v-if="config.icon" :icon="config.icon"></MIcon>
        <span v-if="config.text" class="magic-editor-tab-panel-title">{{ config.text }}</span>
      </div>
    </template>

    <component :is="config.component" v-bind="config.props || {}" v-on="config?.listeners || {}">
      <template #component-list-panel-header v-if="data === 'component-list' || config.slots?.componentListPanelHeader">
        <slot v-if="data === 'component-list'" name="component-list-panel-header"></slot>
        <component v-else-if="config.slots?.componentListPanelHeader" :is="config.slots.componentListPanelHeader" />
      </template>

      <template #layer-panel-header v-if="data === 'layer' || config.slots?.layerPanelHeader">
        <slot v-if="data === 'layer'" name="layer-panel-header"></slot>
        <component v-else-if="config.slots?.layerPanelHeader" :is="config.slots.layerPanelHeader" />
      </template>

      <template #layer-node-content="{ data, node }" v-if="config.slots?.layerNodeContent">
        <component :is="config.slots?.layerNodeContent" :data="data" :node="node" />
      </template>
    </component>
  </el-tab-pane>
</template>
