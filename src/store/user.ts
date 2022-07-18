import { defineStore } from 'pinia'

export default defineStore({
  id: 'user',
  state: () => ({
    name: 'Pinia',
  }),
  actions: {
    updateName(name: string) {
      this.name = name
    },
  },
})
