<script setup lang="ts">
import GridList, { Pagination, RequestFunc } from '@/components/GridList.vue';

const data: RequestFunc<number> = ({ page, limit }: Pagination) => {
  return {
    data: Array.from({ length: 50 }, (_, index) => index + (page - 1) * limit),
    total: 10000,
  };
};
</script>

<template>
  <GridList :request="data" :column-gap="20" :row-gap="20" :item-min-width="200" class="grid-list">
    <template #default="{ item }">
      <div class="item">{{ item }}</div>
    </template>
  </GridList>
</template>

<style scoped lang="scss">
.grid-list {
  width: 100%;
  height: 500px;
}
.item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(42, 129, 100);
  color: aliceblue;
  font-size: 48px;
  font-weight: 400;
}
</style>
