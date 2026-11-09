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

/** CRUD 示例列表查询参数，筛选条件均可省略。 */
export interface DemoQueryParams {
  id?: string
  aInput?: string
  bInput?: string
  cInput?: string
  dSelect?: string
  eSelect?: string
  fSelect?: string
  gSelect?: string
  /** 按开始、结束顺序提交，格式为 YYYY-MM-DD。 */
  createdRange?: [string, string] | null
  pageNum: number
  pageSize: number
}

/** CRUD 示例列表接口响应。 */
export interface DemoApiResponse {
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

