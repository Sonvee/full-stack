import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    /** 侧栏使用的项目 iconfont CSS 类名。 */
    icon?: string
  }
}
