import { START_LOCATION } from 'vue-router'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { useNProgress } from '@/composables/use-nprogress'

/** 注册全局路由守卫，统一管理导航进度条。 */
export function setupRouterGuards(router: Router) {
  const { start, done } = useNProgress()
  let pendingRoute: RouteLocationNormalized | undefined

  function finishProgress(to: RouteLocationNormalized) {
    // 旧导航的取消或错误回调不能结束新导航的进度条。
    if (to !== pendingRoute) return
    pendingRoute = undefined
    done()
  }

  router.beforeEach((to, from) => {
    // 首次进入应用由初始化 loading 提供反馈。
    if (from === START_LOCATION) return
    pendingRoute = to
    start()
  })

  router.afterEach(finishProgress)
  router.onError((_error, to) => {
    finishProgress(to)
  })
}
