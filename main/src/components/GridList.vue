<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    dataSource?: any[];
    itemMinWidth?: number;
    itemMinHeight?: number;
    rowGap?: number;
    columnGap?: number;
  }>(),
  {
    dataSource: () => [],
    request: () => ({
      data: [],
      total: 0,
    }),
    itemMinWidth: () => 200,
    itemMinHeight: () => 200,
    rowGap: () => 0,
    columnGap: () => 0,
  }
);

const emit = defineEmits<{
  (event: 'onSelectChange', value: any): void;
}>();

const containerRef = ref<HTMLDivElement>();
const containerHeight = ref<number>(0);
const containerWidth = ref<number>(0);
const loading = ref<boolean>(false);
const noMore = ref<boolean>(false);
const data = ref<any[]>([]);
/** 起始索引 */
const startIndex = ref<number>(0);
/** 结束索引 */
const endIndex = computed<number>(() => startIndex.value + visibleCount.value);
const startOffset = ref<number>(0);
/** 计算列数 */
const columnNum = computed<number>(
  () => Math.floor((containerWidth.value - props.itemMinWidth) / (props.itemMinWidth + props.columnGap)) + 1
);
/** 计算行数 */
const rowNum = computed<number>(() => Math.ceil(data.value.length / columnNum.value));
/** 计算总高度 */
const listHeight = computed<number>(() => rowNum.value * props.itemMinHeight + (rowNum.value - 1) * props.rowGap);
/** 可见行数 */
const visibleRowNum = computed<number>(
  () => Math.ceil((containerHeight.value - props.itemMinHeight) / (props.itemMinHeight + props.rowGap)) + 1
);
/** 可见item数量 */
const visibleCount = computed<number>(() => visibleRowNum.value * columnNum.value);

watch(
  () => props.dataSource,
  (dataSource) => {
    data.value = [...dataSource];
  },
  { immediate: true }
);

const handleContainerResize = () => {
  nextTick(() => {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight;
      containerWidth.value = containerRef.value.clientWidth;
    }
  });
};

const resizeObserver = new ResizeObserver(handleContainerResize);

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }
});

const handleSelectChange = (value: any) => {
  emit('onSelectChange', value);
};

const handleScroll = () => {
  if (!containerRef.value) {
    return;
  }

  const startRowNum = Math.ceil(
    (containerRef.value.scrollTop - props.itemMinHeight) / (props.itemMinHeight + props.rowGap)
  );
  startIndex.value = startRowNum * columnNum.value;
  startOffset.value =
    containerRef.value.scrollTop - (containerRef.value.scrollTop % (props.itemMinHeight + props.rowGap));
};
</script>

<template>
  <div ref="containerRef" class="infinite-list-wrapper" @scroll="handleScroll">
    <div class="list-phantom"></div>
    <div class="list">
      <slot name="operation"></slot>
      <div v-for="(item, index) in data.slice(startIndex, endIndex)" :key="index" @click="handleSelectChange(item)">
        <slot :item="item" :index="index">
          {{ item }}
        </slot>
      </div>
      <slot v-if="!loading && data.length === 0" name="empty">
        <p></p>
      </slot>
    </div>
    <slot v-if="loading" name="loading">
      <p>Loading...</p>
    </slot>
    <slot v-if="noMore && data.length > 0" name="noMore">
      <p class="no-more-text"></p>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.infinite-list-wrapper {
  text-align: center;
  overflow-y: scroll;
  position: relative;
  -webkit-overflow-scrolling: touch;

  .list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
    height: calc(v-bind(listHeight) * 1px);
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(v-bind(itemMinWidth) * 1px), 1fr));
    grid-auto-rows: minmax(auto, calc(v-bind(itemMinHeight) * 1px));
    column-gap: calc(v-bind(columnGap) * 1px);
    row-gap: calc(v-bind(rowGap) * 1px);
    transform: translate3d(0, calc(v-bind(startOffset) * 1px), 0);

    div:first-of-type {
      grid-column-start: 1;
      grid-column-end: 1;
    }
  }

  .no-more-text {
    font-style: italic;
    font-family: cursive;
  }
}
</style>
