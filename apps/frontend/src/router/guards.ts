import type { Router } from 'vue-router'

/** 注册全局路由守卫，当前默认放行所有导航。 */
export function setupRouterGuards(router: Router) {
  router.beforeEach(() => {
    return true
  })
}
