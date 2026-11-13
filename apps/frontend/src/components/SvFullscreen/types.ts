/** 全屏切换按钮参数。 */
export interface SvFullscreenProps {
  /** 是否同时进入浏览器原生全屏；默认 false，仅在当前窗口内铺满容器。 */
  f11?: boolean
  /** 要铺满的 DOM 元素；窗口模式必传，原生模式不传则展示整个页面。 */
  container?: HTMLElement | null
}
