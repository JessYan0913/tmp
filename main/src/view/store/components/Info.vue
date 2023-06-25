<script setup lang="ts">
import { useAuthStore } from '../auth';

const { state } = useAuthStore();
</script>

<template>
  <div>
    <div v-if="!state.isAuthed">
      <h1>请登录</h1>
    </div>
    <div v-if="state.isAuthed">
      <h1>欢迎：{{ state.account?.name }}</h1>
    </div>
  </div>
</template>
