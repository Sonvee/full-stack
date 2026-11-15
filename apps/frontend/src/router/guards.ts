import { START_LOCATION } from 'vue-router'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { useNProgress } from '@/composables/use-nprogress'

/** 注册全局路由守卫，统一管理导航进度条与缓存页面名称。 */
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

  /** 异步页面组件已加载，在渲染前统一设置缓存匹配名称。 */
  router.beforeResolve((to) => {
    for (const record of to.matched) {
      const component = record.components?.default
      if (record.meta.keepAlive === true && typeof record.name === 'string' && component && typeof component === 'object') {
        component.name = record.name
      }
    }
  })

  router.afterEach(finishProgress)
  router.onError((_error, to) => {
    finishProgress(to)
  })
}
