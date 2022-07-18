<template>
  <h1>Hello App!</h1>
  <el-input :model-value="name" @input="onUsernameInput" />
  <router-view></router-view>
</template>

<script lang="ts">
import { login } from '@/api/account'
import useUserStore from '@/store/user'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore()
    return {
      userStore,
    }
  },
  computed: {
    ...mapState(useUserStore, ['name']),
  },
  mounted() {
    login({ usercode: '1', password: '1' }).then(console.log)
  },
  methods: {
    ...mapActions(useUserStore, ['updateName']),
    onUsernameInput(value: string | number) {
      this.updateName(`${value}`)
    },
  },
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
