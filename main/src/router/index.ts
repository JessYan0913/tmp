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
    path: '/example',
    redirect: '/',
    meta: {
      menu: '组件示例',
    },
    children: [
      {
        path: '/example/video',
        name: 'Video',
        component: () => import('../view/video/index.vue'),
        meta: {
          menu: true,
          leaveCaches: ['/page-B'],
        },
      },
      {
        path: '/example/page-B',
        name: 'EditTable',
        component: () => import('../view/page-B/index.vue'),
        meta: {
          menu: 'EditTable',
          leaveCaches: ['/page-C'],
        },
      },
      {
        path: '/example/page-C',
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
      redirect: '/example/video',
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
