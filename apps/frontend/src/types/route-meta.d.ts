import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    /** 侧栏使用的项目 iconfont CSS 类名。 */
    icon?: string
    /** 默认使用剩余视口高度，由页面内部管理滚动；显式设为 false 时关闭。 */
    fixedHeight?: boolean
  }
}
