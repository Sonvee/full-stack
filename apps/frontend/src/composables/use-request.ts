import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { isPlainObject, omitBy } from 'es-toolkit'
import type { ApiResponse } from '@/types/api'

const client = axios.create({
  baseURL: '/api',
  timeout: 15000,
  // 数组使用重复参数名，与 Fastify 的 querystring 解析保持一致。
  paramsSerializer: { indexes: null },
})

// 仅清理查询参数中的 null、undefined、NaN，保留 0、false、空字符串及空数组、空对象。
client.interceptors.request.use((config) => {
  if (isPlainObject(config.params)) {
    config.params = omitBy(config.params, (value) => {
      return value === null || value === undefined || Number.isNaN(value)
    })
  }
  return config
})

/** 后端未提供错误信息时，按 HTTP 状态码提示。 */
const httpErrorMessages: Record<number, string> = {
  400: '请求参数有误，请检查后重试',
  401: '未登录或登录状态已失效，请重新登录',
  403: '没有权限访问该资源',
  404: '请求的资源不存在',
  409: '数据发生冲突，请刷新后重试',
  429: '请求过于频繁，请稍后重试',
  500: '服务器内部错误，请稍后重试',
  502: '网关异常，请稍后重试',
  503: '服务暂时不可用，请稍后重试',
  504: '网关请求超时，请稍后重试',
}

// Axios 默认接受全部 2xx 响应，包含查询成功的 200 和新增成功的 201。
client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    let message = '请求失败，请稍后重试'
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      if (error.response) {
        const { data, status } = error.response
        message = data?.message || httpErrorMessages[status] || `请求失败（HTTP ${status}）`
      } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        message = '请求超时，请稍后重试'
      } else if (!error.response) {
        message = '网络连接失败，请检查网络或后端服务'
      }
    }
    ElMessage.error(message)
    return Promise.reject(error)
  },
)

/** 返回包含 HTTP code 的响应正文；错误统一提示并继续抛出，由调用方决定页面状态。 */
export default async function useRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await client.request<T>(config)
  return response.data
}
