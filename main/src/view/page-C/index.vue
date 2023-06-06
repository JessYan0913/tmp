<script lang="ts" setup name="Page-C">
import { ref } from 'vue';

const value = ref<number>(0);
</script>

<template>
  <div>
    <h1>Page-C</h1>
    <input v-model="value" type="range" />
  </div>
</template>
