/**
 * 字典按 dict_ 加字段的 snake_case 名称命名，每个字典独立导出。
 * label 表示展示文本，value 表示提交值；同一字典内的 value 必须唯一，并保留字符串或布尔类型。
 */

/** 测试单选字典。 */
export const dict_single_select = [
  { label: '选项甲', value: '选项甲' },
  { label: '选项乙', value: '选项乙' },
  { label: '选项丙', value: '选项丙' },
]

/** 测试多选字典。 */
export const dict_multi_select = [
  { label: '选项甲', value: '选项甲' },
  { label: '选项乙', value: '选项乙' },
  { label: '选项丙', value: '选项丙' },
]

/** 测试开关字典。 */
export const dict_enabled = [
  { label: '开启', value: true },
  { label: '关闭', value: false },
]
