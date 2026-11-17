import type { testSamples } from '../db/schema.js'

export type TestSample = typeof testSamples.$inferSelect

/** 测试样例的可编辑字段，不包含编号和审计时间。 */
export type TestSampleInput = Omit<TestSample, 'id' | 'createdAt' | 'updatedAt'>

export interface TestSampleQueryParams {
  name?: string
  description?: string
  icon?: string
  /** 数字范围，按下限、上限排列。 */
  numberRange?: [number, number]
  status?: string
  singleSelect?: string
  /** 匹配包含全部已选项的记录。 */
  multiSelect?: string[]
  operator?: string
  /** ISO 8601 日期时间范围，按开始、结束排列，包含两端边界。 */
  createdRange?: [string, string]
  /** ISO 8601 日期时间范围，按开始、结束排列，包含两端边界。 */
  updatedRange?: [string, string]
  pageNum: number
  /** 每页条数，-1 表示忽略 pageNum 并查询全部匹配数据。 */
  pageSize: number
}

export interface TestSampleDeleteParams {
  ids: string[]
}

/** 修改测试样例时，在请求体中提交编号和可编辑字段。 */
export interface TestSampleUpdateParams extends TestSampleInput {
  id: string
}
