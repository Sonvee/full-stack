/** API 响应包络，HTTP 状态码同时用于 code。 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  /** 分页查询时返回记录总数。 */
  total?: number
}
