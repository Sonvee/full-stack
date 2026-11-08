/** CRUD 示例列表中的单条数据。 */
export interface DemoListItem {
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

/** CRUD 示例中新增和编辑表单的字段值。 */
export type DemoFormValues = Omit<DemoListItem, 'id' | 'createdAt'>

/** CRUD 示例筛选表单提交的字段值，空字符串表示不限制对应字段。 */
export interface DemoFilterValues extends DemoFormValues {
  id: string
  createdFrom: string
  createdTo: string
}

/** 描述 CRUD 示例字段及其可选值；没有 options 时使用文本输入。 */
export interface DemoFieldDefinition {
  name: keyof DemoFormValues
  label: string
  options?: readonly string[]
}

/** 筛选表单和动作表单共用的字段定义。 */
export const demoFields: DemoFieldDefinition[] = [
  { name: 'a-input', label: '数据项甲' },
  { name: 'b-input', label: '数据项乙' },
  { name: 'c-input', label: '数据项丙' },
  { name: 'd-select', label: '数据项丁', options: ['选项甲', '选项乙', '选项丙', '选项丁'] },
  { name: 'e-select', label: '数据项戊', options: ['选项甲', '选项乙', '选项丙'] },
  { name: 'f-select', label: '数据项己', options: ['选项甲', '选项乙'] },
  { name: 'g-select', label: '数据项庚', options: ['选项甲', '选项乙', '选项丙'] },
]

/** 新增表单的初始值；文本项留空，选择项使用有效默认值。 */
export const defaultDemoFormValues: DemoFormValues = {
  'a-input': '',
  'b-input': '',
  'c-input': '',
  'd-select': '选项甲',
  'e-select': '选项甲',
  'f-select': '选项甲',
  'g-select': '选项甲',
}

/** 未施加筛选时的默认条件，也是筛选重置操作的目标值。 */
export const defaultDemoFilterValues: DemoFilterValues = {
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
 * 按 CRUD 示例字段规则校验值；去除首尾空白后校验，不修改原值。
 *
 * @param value - 待校验的原始值，只接受非空字符串。
 * @param field - 字段标签与可选值范围。
 * @returns 校验通过返回 true，否则返回可直接展示的错误信息。
 */
export function validateDemoFieldValue(
  value: unknown,
  field: DemoFieldDefinition,
): true | string {
  if (typeof value !== 'string' || !value.trim()) {
    return `请填写${field.label}`
  }
  const text = value.trim()
  if (text.length > 100) {
    return `${field.label}不能超过 100 个字符`
  }
  if (field.options && !field.options.includes(text)) {
    return `请选择有效的${field.label}`
  }
  return true
}

/** 查询 CRUD 示例列表。 */
export async function apiDemoList(): Promise<DemoListItem[]> {
  return [
    {
      id: 'R0001',
      'a-input': '数据项甲示例 01',
      'b-input': '数据项乙示例 01',
      'c-input': '数据项丙示例 01',
      'd-select': '选项甲',
      'e-select': '选项甲',
      'f-select': '选项甲',
      'g-select': '选项甲',
      createdAt: '2026-10-01',
    },
    {
      id: 'R0002',
      'a-input': '数据项甲示例 02',
      'b-input': '数据项乙示例 02',
      'c-input': '数据项丙示例 02',
      'd-select': '选项乙',
      'e-select': '选项乙',
      'f-select': '选项乙',
      'g-select': '选项乙',
      createdAt: '2026-10-02',
    },
    {
      id: 'R0003',
      'a-input': '数据项甲示例 03',
      'b-input': '数据项乙示例 03',
      'c-input': '数据项丙示例 03',
      'd-select': '选项丙',
      'e-select': '选项丙',
      'f-select': '选项甲',
      'g-select': '选项丙',
      createdAt: '2026-10-03',
    },
    {
      id: 'R0004',
      'a-input': '数据项甲示例 04',
      'b-input': '数据项乙示例 04',
      'c-input': '数据项丙示例 04',
      'd-select': '选项丁',
      'e-select': '选项甲',
      'f-select': '选项乙',
      'g-select': '选项甲',
      createdAt: '2026-10-04',
    },
    {
      id: 'R0005',
      'a-input': '数据项甲示例 05',
      'b-input': '数据项乙示例 05',
      'c-input': '数据项丙示例 05',
      'd-select': '选项甲',
      'e-select': '选项乙',
      'f-select': '选项甲',
      'g-select': '选项乙',
      createdAt: '2026-10-05',
    },
    {
      id: 'R0006',
      'a-input': '数据项甲示例 06',
      'b-input': '数据项乙示例 06',
      'c-input': '数据项丙示例 06',
      'd-select': '选项乙',
      'e-select': '选项丙',
      'f-select': '选项乙',
      'g-select': '选项丙',
      createdAt: '2026-10-06',
    },
    {
      id: 'R0007',
      'a-input': '数据项甲示例 07',
      'b-input': '数据项乙示例 07',
      'c-input': '数据项丙示例 07',
      'd-select': '选项丙',
      'e-select': '选项甲',
      'f-select': '选项甲',
      'g-select': '选项甲',
      createdAt: '2026-10-07',
    },
    {
      id: 'R0008',
      'a-input': '数据项甲示例 08',
      'b-input': '数据项乙示例 08',
      'c-input': '数据项丙示例 08',
      'd-select': '选项丁',
      'e-select': '选项乙',
      'f-select': '选项乙',
      'g-select': '选项丙',
      createdAt: '2026-10-08',
    },
  ]
}

/** 提交 CRUD 示例新增请求的占位 API。 */
export function apiDemoAdd(values: DemoFormValues): void {
  console.log('新增数据', values)
}

/** 提交 CRUD 示例修改请求的占位 API。 */
export function apiDemoUpdate(id: string, values: DemoFormValues): void {
  console.log('修改数据', id, values)
}

/** 提交 CRUD 示例删除请求的占位 API。 */
export function apiDemoDelete(ids: string[]): void {
  console.log('删除数据', ids)
}

/** 提交 CRUD 示例导入请求的占位 API。 */
export function apiDemoImport(): void {
  console.log('导入数据')
}

/** 提交 CRUD 示例导出请求的占位 API。 */
export function apiDemoExport(): void {
  console.log('导出数据')
}
