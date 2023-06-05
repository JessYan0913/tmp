<script lang="ts" setup name="Page-A">
import { ref } from 'vue';

const value = ref<string>();
</script>

<template>
  <div>
    <h1>Page-A</h1>
    <input v-model="value" />
  </div>
</template>
