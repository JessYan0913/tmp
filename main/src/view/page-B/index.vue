<script lang="ts" setup name="Page-B">
import { ref } from 'vue';

const value = ref<string>();
</script>

<template>
  <div>
    <h1>Page-B</h1>
    <input v-model="value" type="date" />
  </div>
</template>
