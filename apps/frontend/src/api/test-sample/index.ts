import useRequest from '@/composables/use-request'
import type { ApiResponse, PageResponse } from '@/types/api'
import type {
  TestSampleListItem,
  TestSampleDeleteParams,
  TestSampleDeleteResult,
  TestSampleQueryParams,
} from '@/types/test-sample'

/** 分页查询；范围字段直接传数组，保留 0 和 false。 */
export function apiTestSampleList(params: TestSampleQueryParams) {
  return useRequest<PageResponse<TestSampleListItem>>({
    url: '/test-samples',
    method: 'get',
    params: {
      ...params,
      enabled: params.enabled === '' ? undefined : params.enabled,
      singleSelect: params.singleSelect || undefined,
    },
  })
}

/** 新增测试样例。 */
export function apiTestSampleAdd(data: TestSampleListItem) {
  return useRequest<ApiResponse<TestSampleListItem>>({
    url: '/test-samples',
    method: 'post',
    data,
  })
}

/** 按编号修改测试样例。 */
export function apiTestSampleUpdate(id: string, data: TestSampleListItem) {
  return useRequest<ApiResponse<TestSampleListItem>>({
    url: `/test-samples/${id}`,
    method: 'put',
    data,
  })
}

/** 删除单条或已选测试样例。 */
export function apiTestSampleDelete(data: TestSampleDeleteParams) {
  return useRequest<ApiResponse<TestSampleDeleteResult>>({
    url: '/test-samples',
    method: 'delete',
    data,
  })
}
