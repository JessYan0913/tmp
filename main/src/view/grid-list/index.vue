<script setup lang="ts">
import { ref } from 'vue';
import { AsyncQueue } from '@tmp/utils';

import GridList, { RequestFunc } from '@/components/GridList.vue';

const asyncQueue = new AsyncQueue(5);

const clickCount = ref(0);

const data: RequestFunc<number> = ({ page, limit }) => {
  return new Promise((resolve) => {
    console.log('开始加载啦', page, limit);

    setTimeout(() => {
      resolve({
        data: Array.from({ length: limit }, (_, index) => index + (page - 1) * limit),
        total: 300,
      });
    }, 1000);
  });
};

const handleAddTask = () => {
  clickCount.value += 1;
  asyncQueue.addTask([
    () => {
      return new Promise((resolve) => {
        console.log('开始执行任务1');

        setTimeout(() => {
          console.log('执行1');
          resolve(1);
        }, 10000);
      });
    },
    () => {
      return new Promise((resolve) => {
        console.log('开始执行任务2');

        setTimeout(() => {
          console.log('执行2');
          resolve(1);
        }, 10000);
      });
    },
    () => {
      return new Promise((resolve) => {
        console.log('开始执行任务3');

        setTimeout(() => {
          console.log('执行3');
          resolve(1);
        }, 10000);
      });
    },
    () => {
      return new Promise((resolve) => {
        console.log('开始执行任务4');

        setTimeout(() => {
          console.log('执行4');
          resolve(1);
        }, 10000);
      });
    },
    () => {
      return new Promise((resolve) => {
        console.log('开始执行任务5');

        setTimeout(() => {
          console.log('执行5');
          resolve(1);
        }, 10000);
      });
    },
    () => {
      return new Promise((resolve) => {
        console.log('开始执行任务6');

        setTimeout(() => {
          console.log('执行6');
          resolve(1);
        }, 10000);
      });
    },
  ]);
};
</script>

<template>
  <h1>{{ clickCount }}</h1>
  <button @click.prevent="handleAddTask">添加任务</button>
  <GridList :request="data" :column-gap="20" :row-gap="20" :limit="10000" :item-min-width="200" class="grid-list">
    <template #empty>
      <p>暂无数据</p>
    </template>
    <template #default="{ item }">
      <div class="item">{{ item }}</div>
    </template>
    <template #loading>
      <p>加载中...</p>
    </template>
    <template #noMore>
      <p>没有更多了</p>
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
