import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { isPlainObject, omitBy } from 'es-toolkit'
import type { ApiResponse } from '@/types/api'

/** HTTP 状态码。 */
const httpCodeMap: Record<number, string> = {
  400: '请求参数有误，请检查后重试',
  401: '未登录或登录状态已失效，请重新登录',
  403: '没有权限访问该资源',
  404: '请求的资源不存在',
  409: '数据发生冲突，请刷新后重试',
  429: '请求过于频繁，请稍后重试',
  500: '服务器内部错误，请稍后重试',
  502: '网关异常，请稍后重试',
  503: '服务暂时不可用，请稍后重试',
  504: '网关请求超时，请稍后重试'
}

const client = axios.create({
  baseURL: '/api',
  timeout: 60000,
  paramsSerializer: { indexes: null }, // 数组使用重复参数名，与 Fastify 的 querystring 解析保持一致。
  withCredentials: true, // 跨域请求是否需要携带 cookie
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/** 请求拦截器。 */
client.interceptors.request.use(
  (config) => {
    // console.log('请求拦截器 config ===> ', config)

    // 仅清理查询参数中的 null、undefined、NaN，保留 0、false、空字符串及空数组、空对象。
    if (isPlainObject(config.params)) {
      config.params = omitBy(config.params, (value) => {
        return value === null || value === undefined || Number.isNaN(value)
      })
    }
    return config
  },
  (error) => {
    // console.log('请求拦截器 error ===> ', error)

    return Promise.reject(error)
  }
)

/** 响应拦截器。 */
client.interceptors.response.use(
  (res) => {
    // console.log('响应拦截器 res ===> ', res)

    let data = res.data
    return data
  },
  (error: unknown) => {
    // console.log('响应拦截器 error ===> ', error)

    if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
      if (error.response) {
        // console.log('响应拦截器 error.response ===> ', error.response)
        const { data, status, statusText } = error.response
        const httpCode = data?.code ?? status
        const message = data?.message || httpCodeMap[httpCode] || statusText
        ElMessage.error(message)
      } else {
        ElMessage.error(error.message)
      }
    } else {
      ElMessage.error('未知错误，请联系管理员')
    }

    return Promise.reject(error)
  }
)

/** 返回包含 HTTP code 的响应正文；错误统一提示并继续抛出，由调用方决定页面状态。 */
export default async function useRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await client.request<T, T>(config)
  // 响应拦截器已将 AxiosResponse 解包为响应正文。
  return response as T
}
