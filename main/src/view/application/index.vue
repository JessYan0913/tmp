<script lang="ts" setup>
import { useIntervalAsync } from '@/hooks/useIntervalAsync';

const { flush, cancel, recover } = useIntervalAsync(async () => {
  let timeout: any = null;
  await new Promise((resolve) => {
    timeout = setTimeout(() => {
      console.log('模拟异步事件');
      resolve('');
    }, 2000);
  });
  return () => {
    clearTimeout(timeout);
  };
}, 1000);
</script>

<template>
  <div>
    <button @click="flush">刷新</button>
    <button @click="cancel">取消</button>
    <button @click="recover">恢复</button>
  </div>
</template>
