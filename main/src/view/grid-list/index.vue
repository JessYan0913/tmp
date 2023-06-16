<script setup lang="ts">
import GridList from '@/components/GridList.vue';

const data = () => {
  return {
    data: Array.from({ length: 100 }, (_, index) => index),
    total: 10000,
  };
};
</script>

<template>
  <GridList
    :scrollable="false"
    :data-source="data().data"
    :column-gap="20"
    :row-gap="20"
    :item-min-width="250"
    class="grid-list"
  >
    <template #default="{ item }">
      <div class="item">{{ item }}</div>
    </template>
  </GridList>
  <div class="waterfall">
    <div v-for="item in data().data" :key="item">{{ item }}</div>
  </div>
</template>

<style scoped lang="scss">
.grid-list {
  width: 100%;
  height: 300px;
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
.waterfall {
  width: 100%;
  height: 500px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  column-gap: 10px;
  row-gap: 10px;
  // grid-auto-flow: row dense;
  grid-auto-rows: 1px;
  overflow-y: scroll;
  margin-top: 20px;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(113, 136, 49);
    color: aliceblue;
    font-size: 48px;
    font-weight: 400;
  }

  div:nth-of-type(3n + 1) {
    grid-row: span 9;
  }

  div:nth-of-type(3n + 2) {
    grid-row: span 6;
  }

  div:nth-of-type(3n + 3) {
    grid-row: span 8;
  }
}
</style>
