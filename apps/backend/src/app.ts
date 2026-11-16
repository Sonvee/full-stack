import Fastify from 'fastify'
import type { FastifyError } from 'fastify'
import fastifyRedis from '@fastify/redis'
import { env } from './config/env.js'
import { db, pool } from './db/client.js'
import routes from './routes/index.js'

/** 服务端错误的默认提示，与前端请求层保持一致，其余 5xx 使用内部错误提示。 */
const serverErrorMessages: Record<number, string> = {
  502: '网关异常，请稍后重试',
  503: '服务暂时不可用，请稍后重试',
  504: '网关请求超时，请稍后重试',
}

/** 创建后端服务，统一注册基础设施、路由及 HTTP 错误响应。 */
export function buildApp() {
  const app = Fastify({ logger: true })

  // 响应体 code 与实际 HTTP 状态码保持一致，未明确分类的异常使用 500。
  app.setErrorHandler<FastifyError>((error, request, reply) => {
    const code = error.statusCode && error.statusCode >= 400 && error.statusCode <= 599
      ? error.statusCode
      : 500
    if (code >= 500) {
      request.log.error({ err: error }, '请求处理失败')
    }
    return reply.code(code).send({
      code,
      message: code >= 500
        ? (serverErrorMessages[code] ?? '服务器内部错误，请稍后重试')
        : error.message,
    })
  })

  app.setNotFoundHandler((_request, reply) => {
    return reply.code(404).send({ code: 404, message: '接口不存在' })
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
