import type { RouteRecordRaw } from 'vue-router'

export const localRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/index.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/about/index.vue'),
  },
]
