/** API 响应包络，HTTP 状态码同时用于 code，错误响应可省略 data。 */
export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
  /** 分页查询时返回记录总数。 */
  total?: number
}

/** 单条或批量删除接口的通用参数。 */
export interface ApiDeleteParams {
  ids: string[]
}

/** 删除接口返回的实际删除数量。 */
export interface ApiDeleteResult {
  deletedCount: number
}
