<template>
  <div>
    <p>Times clicked: {{ count }}</p>
    <button @click="increment">increment</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref } from 'vue'

let count = ref(0)

const increment = () => {
  count.value = unref(count) + 1
}
</script>
