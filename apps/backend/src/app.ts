import Fastify from 'fastify'
import type { FastifyError } from 'fastify'
import fastifyRedis from '@fastify/redis'
import { env } from './config/env.js'
import { httpCodeMap } from './constants/http.js'
import { db, pool } from './db/client.js'
import routes from './routes/index.js'

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
