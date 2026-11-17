import useRequest from '@/composables/use-request'
import type { ApiDeleteParams, ApiDeleteResult, ApiResponse } from '@/types/api'
import type { DictDetailListItem, DictDetailQueryParams, DictListItem, DictQueryParams } from '@/types/dict'

/** 分页查询字典类型。 */
export function apiDictList(params: DictQueryParams) {
  return useRequest<ApiResponse<DictListItem[]>>({ url: '/dict/list', method: 'get', params })
}

/** 按字典编码查询字典类型详情，支持详情页直接访问。 */
export function apiDictType(dictType: string) {
  return useRequest<ApiResponse<DictListItem>>({ url: `/dict/type/${dictType}`, method: 'get' })
}

/** 新增字典类型。 */
export function apiDictAdd(data: DictListItem) {
  return useRequest<ApiResponse<DictListItem>>({ url: '/dict/add', method: 'post', data })
}

/** 修改字典类型。 */
export function apiDictUpdate(data: DictListItem) {
  return useRequest<ApiResponse<DictListItem>>({ url: '/dict/update', method: 'post', data })
}

/** 删除单条或已选字典类型。 */
export function apiDictDelete(data: ApiDeleteParams) {
  return useRequest<ApiResponse<ApiDeleteResult>>({ url: '/dict/delete', method: 'post', data })
}

/** 按字典编码查询数据项，pageSize 为 -1 时返回全量数据。 */
export function apiDictDetail(params: DictDetailQueryParams) {
  return useRequest<ApiResponse<DictDetailListItem[]>>({ url: `/dict/detail/${params.dictType}`, method: 'get', params })
}

/** 清除当前字典缓存，后续查询时重新缓存。 */
export function apiDictDetailCacheUpdate(dictType: string) {
  return useRequest<ApiResponse<never>>({ url: `/dict/detail/cache/${dictType}`, method: 'post' })
}

/** 新增字典数据。 */
export function apiDictDetailAdd(data: DictDetailListItem) {
  return useRequest<ApiResponse<DictDetailListItem>>({ url: '/dict/detail/add', method: 'post', data })
}

/** 修改字典数据。 */
export function apiDictDetailUpdate(data: DictDetailListItem) {
  return useRequest<ApiResponse<DictDetailListItem>>({ url: '/dict/detail/update', method: 'post', data })
}

/** 删除单条或已选字典数据，始终限定所属字典。 */
export function apiDictDetailDelete(dictType: string, data: ApiDeleteParams) {
  return useRequest<ApiResponse<ApiDeleteResult>>({ url: '/dict/detail/delete', method: 'post', data: { ...data, dictType } })
}
