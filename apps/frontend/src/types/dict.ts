/** 通用字典选项。 */
export interface DictOption {
  label: string
  value: string | boolean
  /** 字典标签的样式类型。 */
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
}
