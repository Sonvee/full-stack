import type { RouteRecordRaw } from 'vue-router'

/** 管理端的页面层级，同时作为侧栏菜单和面包屑的数据来源。 */
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'admin-dashboard',
    component: () => import('../views/admin/dashboard/index.vue'),
    meta: { title: '工作台', icon: 'sv-icon-viewdashboard' },
  },
  {
    path: 'tools',
    name: 'admin-tools',
    redirect: { name: 'admin-crud' },
    meta: { title: '系统工具', icon: 'sv-icon-tool' },
    children: [
      {
        path: 'crud',
        name: 'admin-crud',
        component: () => import('../views/admin/tools/crud/index.vue'),
        meta: { title: 'CRUD 模板', icon: 'sv-icon-table', fixedHeight: true },
      },
      {
        path: 'icons',
        name: 'admin-icons',
        component: () => import('../views/admin/tools/icons/index.vue'),
        meta: { title: '图标库', icon: 'sv-icon-my-icons' },
      },
    ],
  },
]
