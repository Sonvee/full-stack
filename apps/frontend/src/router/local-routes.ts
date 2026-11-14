import type { RouteRecordRaw } from 'vue-router'
import { adminRoutes } from './admin-routes'

export const localRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/index.vue'),
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/login.vue'),
    meta: { title: '管理端登录' },
  },
  {
    path: '/admin',
    component: () => import('../layouts/admin-layout/index.vue'),
    children: adminRoutes,
  },
]
