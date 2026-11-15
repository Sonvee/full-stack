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
    redirect: { name: 'admin-test-sample' },
    meta: { title: '系统工具', icon: 'sv-icon-tool' },
    children: [
      {
        path: 'test-sample',
        name: 'admin-test-sample',
        component: () => import('../views/admin/tools/test-sample/index.vue'),
        meta: { title: '测试样例', icon: 'sv-icon-tool' },
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
