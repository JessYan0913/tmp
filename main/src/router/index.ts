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
    redirect: '/page-A',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '/page-A',
        name: 'Page-A',
        component: () => import('../view/page-A/index.vue'),
        meta: {
          leaveCaches: ['/page-B'],
        },
      },
      {
        path: '/page-B',
        name: 'Page-B',
        component: () => import('../view/page-B/index.vue'),
        meta: {
          leaveCaches: ['/page-C'],
        },
      },
      {
        path: '/page-C',
        name: 'Page-C',
        component: () => import('../view/page-C/index.vue'),
      },
      {
        path: '/application',
        name: 'Application',
        component: () => import('../view/application/index.vue'),
        meta: {
          leaveCaches: ['/application/setting'],
        },
      },
      {
        path: '/application/setting',
        name: 'ApplicationSetting',
        component: () => import('../view/application-setting/index.vue'),
        meta: {
          leaveCaches: ['/application'],
        },
      },
      {
        path: '/webgl/01',
        name: 'Webgl01',
        component: () => import('../view/webgl-01/index.vue'),
      },
      {
        path: '/three',
        name: 'Three',
        component: () => import('../view/three/index.vue'),
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
