/**
 * 模板数据契约；复制页面后可替换为实际接口返回类型。
 *
 * @remarks
 * 可填写字段采用“序号-控件类型”命名，input 表示文本输入，select 表示下拉选择。
 * id 在当前列表内唯一，createdAt 使用 YYYY-MM-DD 格式供日期筛选与排序使用。
 */
export interface DataRecord {
  id: string
  'a-input': string
  'b-input': string
  'c-input': string
  'd-select': string
  'e-select': string
  'f-select': string
  'g-select': string
  createdAt: string
}

/** 新增、编辑和导入使用的可填写字段；编号与创建日期由页面生成。 */
export type FormValues = Omit<DataRecord, 'id' | 'createdAt'>

/**
 * 已提交的筛选条件；空字符串表示不限制对应字段。
 * 日期使用 YYYY-MM-DD 格式，起止边界均包含当天，由表单中的日期范围字段映射而来。
 */
export interface FilterValues extends FormValues {
  id: string
  createdFrom: string
  createdTo: string
}

/** 有 options 时使用下拉选择并校验选项范围，否则使用文本输入。 */
export interface FieldDefinition {
  name: keyof FormValues
  label: string
  options?: readonly string[]
}

/** 筛选、动作表单、表格列与导入校验共用字段定义。 */
export const fields: FieldDefinition[] = [
  { name: 'a-input', label: '数据项甲' },
  { name: 'b-input', label: '数据项乙' },
  { name: 'c-input', label: '数据项丙' },
  { name: 'd-select', label: '数据项丁', options: ['选项甲', '选项乙', '选项丙', '选项丁'] },
  { name: 'e-select', label: '数据项戊', options: ['选项甲', '选项乙', '选项丙'] },
  { name: 'f-select', label: '数据项己', options: ['选项甲', '选项乙'] },
  { name: 'g-select', label: '数据项庚', options: ['选项甲', '选项乙', '选项丙'] },
]

/** 新增表单的初始值；文本项留空，选项项使用有效默认选项。 */
export const defaultFormValues: FormValues = {
  'a-input': '',
  'b-input': '',
  'c-input': '',
  'd-select': '选项甲',
  'e-select': '选项甲',
  'f-select': '选项甲',
  'g-select': '选项甲',
}

/** 未施加任何筛选的条件，也是重置操作的目标值。 */
export const defaultFilterValues: FilterValues = {
  'a-input': '',
  'b-input': '',
  'c-input': '',
  'd-select': '',
  'e-select': '',
  'f-select': '',
  'g-select': '',
  id: '',
  createdFrom: '',
  createdTo: '',
}

/**
 * 弹窗与 JSON 导入共用字段规则；按去除首尾空白后的内容校验，不修改原值。
 *
 * @param value - 待校验的原始值，只接受非空字符串。
 * @param field - 字段标签与可选值范围。
 * @returns 校验通过返回 true，否则返回可直接展示的错误信息。
 */
export function validateFieldValue(value: unknown, field: FieldDefinition): true | string {
  if (typeof value !== 'string' || !value.trim()) return `请填写${field.label}`
  const text = value.trim()
  if (text.length > 100) return `${field.label}不能超过 100 个字符`
  if (field.options && !field.options.includes(text)) return `请选择有效的${field.label}`
  return true
}

/**
 * 将外部 JSON 数据转换为可导入的表单值；移除首尾空白，忽略编号、日期与额外字段。
 * 仅在整个数组校验通过后返回结果，调用方收到结果后再统一写入列表。
 *
 * @param value - JSON.parse 的结果，必须是非空数组，且每条记录包含所有模板字段。
 * @returns 保持原始顺序的表单值数组，编号与创建日期交由页面生成。
 * @throws 当数组为空、记录格式不正确或任一字段校验失败时抛出 Error。
 */
export function parseImportedRecords(value: unknown): FormValues[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error('文件内容必须是非空的数据数组')
  return value.map((entry: unknown, index) => {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error(`第 ${index + 1} 条数据格式错误`)
    }
    const record = entry as Record<string, unknown>
    const entries = fields.map((field) => {
      const result = validateFieldValue(record[field.name], field)
      if (result !== true) throw new Error(`第 ${index + 1} 条：${result}`)
      return [field.name, (record[field.name] as string).trim()]
    })
    return Object.fromEntries(entries) as FormValues
  })
}
