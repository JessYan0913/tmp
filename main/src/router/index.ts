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
    path: '/path',
    redirect: '/',
    meta: {
      menu: '组件示例',
    },
    children: [
      {
        path: '/path/page-A',
        name: 'Page-A',
        component: () => import('../view/page-A/index.vue'),
        meta: {
          menu: '页面一',
          leaveCaches: ['/page-B'],
        },
      },
      {
        path: '/path/page-B',
        name: 'Page-B',
        component: () => import('../view/page-B/index.vue'),
        meta: {
          menu: '页面二',
          leaveCaches: ['/page-C'],
        },
      },
      {
        path: '/path/page-C',
        name: 'Page-C',
        component: () => import('../view/page-C/index.vue'),
        meta: {
          menu: '页面三',
        },
      },
    ],
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
      redirect: '/path/page-A',
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
