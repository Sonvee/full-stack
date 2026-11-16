import Fastify from 'fastify'
import type { FastifyError } from 'fastify'
import fastifyRedis from '@fastify/redis'
import { env } from './config/env.js'
import { db, pool } from './db/client.js'
import routes from './routes/index.js'

/** HTTP 状态码的默认提示，与前端请求层保持一致。 */
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
  504: '网关请求超时，请稍后重试',
}

/** 创建后端服务，统一注册基础设施、路由及 HTTP 错误响应。 */
export function buildApp() {
  const app = Fastify({ logger: true })

  // 响应体 code 与实际 HTTP 状态码保持一致，未明确分类的异常使用 500。
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    const code = error.statusCode ?? 500

    const message = error.message || httpCodeMap[code] || '请求失败，请稍后重试'
    request.log.error({ err: error }, '请求处理失败')

    return reply.code(code).send({ code, message })
  })

  app.setNotFoundHandler((_request, reply) => {
    return reply.code(404).send({ code: 404, message: httpCodeMap[404] })
  })

  app.decorate('db', db)
  app.addHook('onReady', async () => {
    await pool.query('select 1')
  })
  app.addHook('onClose', async () => {
    await pool.end()
  })

  app.register(fastifyRedis, { url: env.redisUrl, closeClient: true })
  app.register(routes)

  return app
}
