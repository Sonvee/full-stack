import iconfontCss from '@/assets/iconfont/iconfont.css?raw'

/** 从项目字体样式读取图标类名，供图标库页面和图标选择器共用。 */
export const iconNames = (iconfontCss.match(/\.sv-icon-[\w-]+(?=:before)/g) ?? []).map((name) => name.slice(1))
