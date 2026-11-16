import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    /** 侧栏使用的项目 iconfont CSS 类名。 */
    icon?: string
    /** 仅隐藏导航入口，路由仍正常注册并可直接访问。 */
    hide?: boolean
    /** 默认使用剩余视口高度，由页面内部管理滚动；显式设为 false 时关闭。 */
    fixedHeight?: boolean
    /** 显式设为 true 时按页面路径缓存管理端页面；路由须提供字符串 name，组件名称由路由守卫统一设置。 */
    keepAlive?: boolean
  }
}
