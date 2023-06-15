<script setup lang="ts">
import GridList from '@/components/GridList.vue';

const data = Array.from({ length: 20 }, (_, index) => index);
</script>

<template>
  <GridList
    :data-source="data"
    column-gap="20px"
    row-gap="20px"
    item-min-width="250px"
    :operable="false"
    class="grid-list"
  >
    <template #default="{ item }">
      <div class="item">{{ item }}</div>
    </template>
  </GridList>
</template>

<style scoped>
.grid-list {
  width: 100%;
  height: 500px;
}
.item {
  background-color: rgb(42, 129, 100);
  color: aliceblue;
  font-size: 24px;
  font-weight: 400;
}
</style>
