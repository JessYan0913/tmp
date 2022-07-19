<template>
  <h1>Hello App!</h1>
  <counter-panel />
  <el-input :model-value="name" @input="onUsernameInput" />
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { login } from '@/api/account'
import useUserStore from '@/store/user'
import CounterPanel from './components/CounterPanel.vue'

const userStore = useUserStore()

const name = computed(() => userStore.name)

login({ usercode: '1', password: '1' }).then(console.log)

const onUsernameInput = (value: string | number) => {
  userStore.updateName(`${value}`)
}

// import { defineComponent } from 'vue'
// import { mapState, mapActions } from 'pinia'
// export default defineComponent({
//   name: 'App',
//   computed: {
//     ...mapState(useUserStore, ['name']),
//   },
//   mounted() {
//     login({ usercode: '1', password: '1' }).then(console.log)
//   },
//   methods: {
//     ...mapActions(useUserStore, ['updateName']),
//     onUsernameInput(value: string | number) {
//       this.updateName(`${value}`)
//     },
//   },
// })
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
