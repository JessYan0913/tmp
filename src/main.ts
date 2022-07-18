import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from './router'
import store from './store'

import './style.css'
import 'element-plus/theme-chalk/index.css'

import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
