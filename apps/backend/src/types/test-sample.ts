import type { testSamples } from '../db/schema.js'

export type TestSample = typeof testSamples.$inferSelect

/** 编号和审计时间由服务端生成，客户端只提交可编辑字段。 */
export type TestSampleInput = Omit<TestSample, 'id' | 'createdAt' | 'updatedAt'>

export interface TestSampleQueryParams {
  name?: string
  description?: string
  icon?: string
  /** 数字范围，按下限、上限排列。 */
  numberRange?: [number, number]
  enabled?: boolean
  singleSelect?: string
  /** 匹配包含全部已选项的记录。 */
  multiSelect?: string[]
  operator?: string
  /** Unix 毫秒时间戳范围，按开始、结束排列，包含两端边界。 */
  createdRange?: [number, number]
  /** Unix 毫秒时间戳范围，按开始、结束排列，包含两端边界。 */
  updatedRange?: [number, number]
  pageNum: number
  pageSize: number
}

export interface TestSampleDeleteParams {
  ids: string[]
}

export interface TestSampleIdParams {
  id: string
}
