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
    path: 'guide',
    name: 'admin-guide',
    component: () => import('../views/admin/guide/index.vue'),
    meta: { title: '布局说明', icon: 'sv-icon-informationoutline' },
  },
  {
    path: 'notifications',
    name: 'admin-notifications',
    component: () => import('../views/admin/notifications/index.vue'),
    meta: { title: '消息中心', icon: 'sv-icon-bell' },
  },
  {
    path: 'examples',
    name: 'admin-examples',
    redirect: { name: 'admin-buttons' },
    meta: { title: '页面示例', icon: 'sv-icon-muban' },
    children: [
      {
        path: 'crud',
        name: 'admin-crud',
        component: () => import('../views/admin/examples/crud/index.vue'),
        meta: { title: 'CRUD 模板', icon: 'sv-icon-table', fixedHeight: true },
      },
      {
        path: 'buttons',
        name: 'admin-buttons',
        component: () => import('../views/admin/examples/buttons/index.vue'),
        meta: { title: '按钮交互', icon: 'sv-icon-cursorpointer' },
      },
      {
        path: 'typography',
        name: 'admin-typography',
        component: () => import('../views/admin/examples/typography/index.vue'),
        meta: { title: '排版展示', icon: 'sv-icon-formattext' },
      },
    ],
  },
  {
    path: 'system',
    name: 'admin-system',
    redirect: { name: 'admin-roles' },
    meta: { title: '系统演示', icon: 'sv-icon-settings' },
    children: [
      {
        path: 'access',
        name: 'admin-access',
        redirect: { name: 'admin-roles' },
        meta: { title: '权限管理', icon: 'sv-icon-shield' },
        children: [
          {
            path: 'roles',
            name: 'admin-roles',
            component: () => import('../views/admin/system/access/roles/index.vue'),
            meta: { title: '角色列表', icon: 'sv-icon-accountkey' },
          },
          {
            path: 'members',
            name: 'admin-members',
            component: () => import('../views/admin/system/access/members/index.vue'),
            meta: { title: '成员列表', icon: 'sv-icon-accountmultiple' },
          },
        ],
      },
    ],
  },
]
