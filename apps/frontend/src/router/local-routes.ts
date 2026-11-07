import type { RouteRecordRaw } from 'vue-router'
import { adminRoutes } from './admin-routes'

export const localRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/admin',
    component: () => import('../layouts/admin-layout/index.vue'),
    children: adminRoutes,
  },
]
