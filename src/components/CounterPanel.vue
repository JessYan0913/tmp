<template>
  <div>
    <p>Times clicked: {{ count }}</p>
    <button @click="increment">increment</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value += 1
}
</script>
