/** CRUD 示例列表中的单条数据。 */
export interface DemoListItem {
  id: string
  aInput: string
  bInput: string
  cInput: string
  dSelect: string
  eSelect: string
  fSelect: string
  gSelect: string
  createdAt: string
}

/** CRUD 示例中新增和编辑表单的字段值。 */
export type DemoFormValues = Omit<DemoListItem, 'id' | 'createdAt'>

/** CRUD 示例列表查询参数，筛选条件与分页参数一起提交。 */
export interface DemoListParams extends DemoFilterValues {
  pageNum: number
  pageSize: number
}

/** CRUD 示例列表接口响应。 */
export interface DemoListResponse {
  code: number
  data: DemoListItem[]
  message: string
  total: number
}

/** CRUD 示例字典选项。 */
export interface DemoDictOption {
  label: string
  value: string
}

/** 页面统一维护并提供给 CRUD 子组件的字典数据。 */
export interface DemoDictData {
  readonly dict_d_select: readonly DemoDictOption[]
  readonly dict_e_select: readonly DemoDictOption[]
  readonly dict_f_select: readonly DemoDictOption[]
  readonly dict_g_select: readonly DemoDictOption[]
}

/** CRUD 示例筛选条件；文本为空字符串、日期范围为 null 时表示不限制该字段。 */
export interface DemoFilterValues extends DemoFormValues {
  id: string
  /** 按开始、结束顺序提交，格式为 YYYY-MM-DD。 */
  createdRange: [string, string] | null
}

