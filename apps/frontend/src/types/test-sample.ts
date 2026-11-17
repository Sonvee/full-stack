/** 测试样例列表与新增、修改表单共用的数据。 */
export interface TestSampleListItem {
  id?: string
  name: string
  description: string
  icon: string
  number: number
  /** 排序值，数值越小越靠前。 */
  index: number
  status: string
  singleSelect: string
  multiSelect: string[]
  /** 当前未接入登录，由表单填写最后一次操作人的名称。 */
  operator: string
  /** ISO 8601 日期时间字符串。 */
  createdAt?: string
  /** ISO 8601 日期时间字符串。 */
  updatedAt?: string
}

/** 测试样例列表查询参数，筛选条件均可省略。 */
export interface TestSampleQueryParams {
  name?: string
  description?: string
  icon?: string
  numberRange?: [number, number]
  status?: string
  singleSelect?: string
  multiSelect?: string[]
  operator?: string
  /** ISO 8601 日期时间范围。 */
  createdRange?: [string, string] | null
  /** ISO 8601 日期时间范围。 */
  updatedRange?: [string, string] | null
  pageNum: number
  /** 每页条数，-1 表示忽略 pageNum 并查询全部匹配数据。 */
  pageSize: number
}
