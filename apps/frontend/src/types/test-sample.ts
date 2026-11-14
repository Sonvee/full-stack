/** 测试样例列表与新增、修改表单共用的数据。 */
export interface TestSampleListItem {
  id?: string
  name: string
  description: string
  icon: string
  number: number
  /** 排序值，数值越小越靠前。 */
  index: number
  enabled: boolean
  singleSelect: string
  multiSelect: string[]
  /** 当前未接入登录，由表单填写最后一次操作人的名称。 */
  operator: string
  /** Unix 毫秒时间戳。 */
  createdAt?: number
  /** Unix 毫秒时间戳。 */
  updatedAt?: number
}

/** 测试样例列表查询参数，筛选条件均可省略。 */
export interface TestSampleQueryParams {
  name?: string
  description?: string
  icon?: string
  numberRange?: [number, number]
  enabled?: boolean
  singleSelect?: string
  multiSelect?: string[]
  operator?: string
  /** Unix 毫秒时间戳范围。 */
  createdRange?: [number, number] | null
  /** Unix 毫秒时间戳范围。 */
  updatedRange?: [number, number] | null
  pageNum: number
  /** 每页条数，-1 表示忽略 pageNum 并查询全部匹配数据。 */
  pageSize: number
}
