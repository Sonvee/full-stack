import useRequest from '@/composables/use-request'
import type { ApiResponse } from '@/types/api'
import type {
  TestSampleListItem,
  TestSampleDeleteParams,
  TestSampleDeleteResult,
  TestSampleQueryParams,
} from '@/types/test-sample'

/** 分页查询测试样例。 */
export function apiTestSampleList(params: TestSampleQueryParams) {
  return useRequest<ApiResponse<TestSampleListItem[]>>({
    url: '/test-samples/list',
    method: 'get',
    params,
  })
}

/** 新增测试样例。 */
export function apiTestSampleAdd(data: TestSampleListItem) {
  return useRequest<ApiResponse<TestSampleListItem>>({
    url: '/test-samples/add',
    method: 'post',
    data,
  })
}

/** 按编号修改测试样例。 */
export function apiTestSampleUpdate(data: TestSampleListItem) {
  return useRequest<ApiResponse<TestSampleListItem>>({
    url: '/test-samples/update',
    method: 'post',
    data,
  })
}

/** 删除单条或已选测试样例。 */
export function apiTestSampleDelete(data: TestSampleDeleteParams) {
  return useRequest<ApiResponse<TestSampleDeleteResult>>({
    url: '/test-samples/delete',
    method: 'post',
    data,
  })
}
