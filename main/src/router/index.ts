import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import useRoutersStore from '@/store/routers';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    redirect: '/application',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '/application',
        name: 'Application',
        component: () => import('../view/application/index.vue'),
        meta: {
          leaveCaches: ['/'],
        },
      },
      {
        path: '/application/setting',
        name: 'ApplicationSetting',
        component: () => import('../view/application-setting/index.vue'),
      },
    ],
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
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const { cacheRouter } = useRoutersStore();
  cacheRouter(from, to);
  next();
});

export default router;