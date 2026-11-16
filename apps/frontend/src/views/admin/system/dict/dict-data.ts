import type { DictOption } from '@/types/dict'

/** 系统启停状态，字典值统一使用字符串。 */
export const sys_status: readonly DictOption[] = [
  { label: '启用', value: '1', type: 'primary' },
  { label: '停用', value: '0', type: 'danger' }
]

/** 与 Element Plus 标签组件支持的类型保持一致。 */
export const sys_tag_type: readonly DictOption[] = [
  { label: '主要', value: 'primary', type: 'primary' },
  { label: '成功', value: 'success', type: 'success' },
  { label: '信息', value: 'info', type: 'info' },
  { label: '警告', value: 'warning', type: 'warning' },
  { label: '危险', value: 'danger', type: 'danger' }
]
