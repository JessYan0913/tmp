import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index', //使用redirect重定向，默认系统显示的第一页
  },
  {
    path: '/index',
    component: () => import('@/components/HelloWorld.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/about',
    component: () => import('@/components/AboutMe.vue'),
    meta: { title: '线条' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${document.title} - ${to.meta.title}`
  }
  next()
})

export default router
