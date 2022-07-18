<script setup lang="ts">
import { login } from '../api/account'
login({
  usercode: 'd',
  password: '33',
}).then((res) => {
  console.log(res.permission)
  console.log(res.token)
})
</script>

<template>
  <h1>你好</h1>
</template>
