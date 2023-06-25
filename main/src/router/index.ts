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
          leaveCaches: ['/edit-table'],
        },
      },
      {
        path: '/example/edit-table',
        name: 'EditTable',
        component: () => import('../view/edit-table/index.vue'),
        meta: {
          menu: true,
          leaveCaches: ['/example/webgl'],
        },
      },
      {
        path: '/example/webgl',
        name: 'WebGL',
        component: () => import('../view/webgl/index.vue'),
        meta: {
          menu: true,
        },
      },
      {
        path: '/example/resizable',
        name: 'Resizable',
        component: () => import('../view/resizable/index.vue'),
        meta: {
          menu: true,
        },
      },
      {
        path: '/example/grid-list',
        name: 'GridList',
        component: () => import('../view/grid-list/index.vue'),
        meta: {
          menu: true,
        },
      },
      {
        path: '/example/store',
        name: 'Store',
        component: () => import('../view/store/index.vue'),
        meta: {
          menu: true,
        },
      },
    ],
  },
  {
    path: '/page',
    name: 'Page',
    component: () => import('../view/page/index.vue'),
    meta: {
      menu: '动态页面',
    },
  },
  {
    path: '/three-scene',
    name: 'Three',
    component: () => import('../view/three-scene/index.vue'),
    meta: {
      menu: '3D场景',
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
      path: '/page-editor',
      name: 'PageEditor',
      component: () => import('../view/page-editor/index.vue'),
    },
    {
      path: '/example/grid-list',
      name: 'GridList',
      component: () => import('../view/grid-list/index.vue'),
      meta: {
        menu: true,
      },
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
