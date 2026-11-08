/** 模板数据契约；复制页面后可替换为实际接口返回类型。 */
export interface DataRecord {
  id: string
  a: string
  b: string
  c: string
  d: string
  e: string
  f: string
  g: string
  createdAt: string
}

export type FormValues = Omit<DataRecord, 'id' | 'createdAt'>

export interface FilterValues extends FormValues {
  id: string
  createdFrom: string
  createdTo: string
}

export interface FieldDefinition {
  name: keyof FormValues
  label: string
  options?: readonly string[]
}

/** 筛选、动作表单、表格列与导入校验共用字段定义。 */
export const fields: FieldDefinition[] = [
  { name: 'a', label: '数据项甲' },
  { name: 'b', label: '数据项乙' },
  { name: 'c', label: '数据项丙' },
  { name: 'd', label: '数据项丁', options: ['选项甲', '选项乙', '选项丙', '选项丁'] },
  { name: 'e', label: '数据项戊', options: ['选项甲', '选项乙', '选项丙'] },
  { name: 'f', label: '数据项己', options: ['选项甲', '选项乙'] },
  { name: 'g', label: '数据项庚', options: ['选项甲', '选项乙', '选项丙'] },
]

export const defaultFormValues: FormValues = {
  a: '',
  b: '',
  c: '',
  d: '选项甲',
  e: '选项甲',
  f: '选项甲',
  g: '选项甲',
}

export const defaultFilterValues: FilterValues = {
  a: '',
  b: '',
  c: '',
  d: '',
  e: '',
  f: '',
  g: '',
  id: '',
  createdFrom: '',
  createdTo: '',
}

/** 弹窗与 JSON 导入共用规则，保持两种录入方式的数据约束一致。 */
export function validateFieldValue(value: unknown, field: FieldDefinition): true | string {
  if (typeof value !== 'string' || !value.trim()) return `请填写${field.label}`
  const text = value.trim()
  if (text.length > 100) return `${field.label}不能超过 100 个字符`
  if (field.options && !field.options.includes(text)) return `请选择有效的${field.label}`
  return true
}

/** 接受本页面导出的数据数组；忽略外部编号与创建日期，由页面统一生成。 */
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
