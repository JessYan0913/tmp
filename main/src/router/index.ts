import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import useRoutersStore from '@/store/routers';

export const routes: RouteRecordRaw[] = [
  {
    path: '/page-A',
    name: 'Page-A',
    component: () => import('../view/page-A/index.vue'),
    meta: {
      menu: true,
      leaveCaches: ['/page-B'],
    },
  },
  {
    path: '/page-B',
    name: 'Page-B',
    component: () => import('../view/page-B/index.vue'),
    meta: {
      menu: true,
      leaveCaches: ['/page-C'],
    },
  },
  {
    path: '/page-C',
    name: 'Page-C',
    component: () => import('../view/page-C/index.vue'),
    meta: {
      menu: true,
    },
  },
  {
    path: '/three',
    name: 'Three',
    component: () => import('../view/three/index.vue'),
    meta: {
      menu: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/page-A',
      component: () => import('../layout/index.vue'),
      children: routes,
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../layout/404.vue'),
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404',
    },
  ],
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const { cacheRouter } = useRoutersStore();
  cacheRouter(from, to);
  next();
});

export default router;
