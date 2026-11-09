import type { DemoDictOption } from '@/types/demo'

/**
 * 字典按 dict_ 加字段的 snake_case 名称命名，每个字典独立导出。
 * 每项统一使用 label 表示展示文本、value 表示提交值；同一字典内的 value 必须唯一。
 */

/** 数据项丁字典。 */
export const dict_d_select: readonly DemoDictOption[] = [
  { label: '选项甲', value: '选项甲' },
  { label: '选项乙', value: '选项乙' },
  { label: '选项丙', value: '选项丙' },
  { label: '选项丁', value: '选项丁' },
]

/** 数据项戊字典。 */
export const dict_e_select: readonly DemoDictOption[] = [
  { label: '选项甲', value: '选项甲' },
  { label: '选项乙', value: '选项乙' },
  { label: '选项丙', value: '选项丙' },
]

/** 数据项己字典。 */
export const dict_f_select: readonly DemoDictOption[] = [
  { label: '选项甲', value: '选项甲' },
  { label: '选项乙', value: '选项乙' },
]

/** 数据项庚字典。 */
export const dict_g_select: readonly DemoDictOption[] = [
  { label: '选项甲', value: '选项甲' },
  { label: '选项乙', value: '选项乙' },
  { label: '选项丙', value: '选项丙' },
]
