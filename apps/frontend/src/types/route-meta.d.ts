import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    /** 侧栏使用的项目 iconfont CSS 类名。 */
    icon?: string
    /** 内容区使用剩余视口高度，由页面内部管理滚动。 */
    fixedHeight?: boolean
  }
}
