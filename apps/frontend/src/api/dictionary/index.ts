import useRequest from '@/composables/use-request'
import type { ApiDeleteParams, ApiDeleteResult, ApiResponse } from '@/types/api'
import type { DictionaryDataListItem, DictionaryDataQueryParams, DictionaryListItem, DictionaryQueryParams } from '@/types/dictionary'

/** 分页查询字典类型。 */
export function apiDictionaryList(params: DictionaryQueryParams) {
  return useRequest<ApiResponse<DictionaryListItem[]>>({ url: '/dictionaries/list', method: 'get', params })
}

/** 按编号查询所属字典，支持详情页直接访问。 */
export function apiDictionaryDetail(id: string) {
  return useRequest<ApiResponse<DictionaryListItem>>({ url: `/dictionaries/${id}`, method: 'get' })
}

/** 新增字典类型。 */
export function apiDictionaryAdd(data: DictionaryListItem) {
  return useRequest<ApiResponse<DictionaryListItem>>({ url: '/dictionaries/add', method: 'post', data })
}

/** 修改字典类型。 */
export function apiDictionaryUpdate(data: DictionaryListItem) {
  return useRequest<ApiResponse<DictionaryListItem>>({ url: '/dictionaries/update', method: 'post', data })
}

/** 删除单条或已选字典类型。 */
export function apiDictionaryDelete(data: ApiDeleteParams) {
  return useRequest<ApiResponse<ApiDeleteResult>>({ url: '/dictionaries/delete', method: 'post', data })
}

/** 分页查询所属字典的数据项。 */
export function apiDictionaryDataList(params: DictionaryDataQueryParams) {
  return useRequest<ApiResponse<DictionaryDataListItem[]>>({ url: '/dictionaries/data/list', method: 'get', params })
}

/** 新增字典数据。 */
export function apiDictionaryDataAdd(data: DictionaryDataListItem) {
  return useRequest<ApiResponse<DictionaryDataListItem>>({ url: '/dictionaries/data/add', method: 'post', data })
}

/** 修改字典数据。 */
export function apiDictionaryDataUpdate(data: DictionaryDataListItem) {
  return useRequest<ApiResponse<DictionaryDataListItem>>({ url: '/dictionaries/data/update', method: 'post', data })
}

/** 删除单条或已选字典数据，始终限定所属字典。 */
export function apiDictionaryDataDelete(dictionaryId: string, data: ApiDeleteParams) {
  return useRequest<ApiResponse<ApiDeleteResult>>({ url: '/dictionaries/data/delete', method: 'post', data: { ...data, dictionaryId } })
}
