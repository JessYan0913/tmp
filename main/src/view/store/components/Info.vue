<script setup lang="ts">
import { useAuthStore } from '../auth';

const { state } = useAuthStore();
</script>

<template>
  <div class="container">
    <div v-if="!state.isAuthed">
      <h1>请登录</h1>
    </div>
    <div v-if="state.isAuthed">
      <h1>欢迎：{{ state.account?.name }}</h1>
    </div>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid salmon;
  width: 500px;
}
</style>
