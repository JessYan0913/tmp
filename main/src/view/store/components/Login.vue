<script setup lang="ts">
import { ref } from 'vue';

import { useAuthStore } from '../auth';

const username = ref('');
const { state, actions } = useAuthStore();
</script>

<template>
  <div class="container">
    <div v-if="!state.isAuthed">
      <div>
        <span>用户名：</span>
        <input v-model="username" />
      </div>
      <button @click="actions.login({ name: username })">登录</button>
    </div>
    <button v-if="state.isAuthed" @click="actions.logout">退出</button>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid rgb(114, 232, 250);
  width: 500px;
}
</style>
