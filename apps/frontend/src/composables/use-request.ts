import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/api'

const client = axios.create({
  baseURL: '/api',
  timeout: 15000,
  // 数组使用重复参数名，与 Fastify 的 querystring 解析保持一致。
  paramsSerializer: { indexes: null },
})

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    let message = '请求失败，请稍后重试'
    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      if (error.response?.data?.message) {
        message = error.response.data.message
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

/** 返回响应正文；错误统一提示后继续抛出，由调用方决定页面状态。 */
export default async function useRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await client.request<T>(config)
  return response.data
}
