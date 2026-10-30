import Fastify from 'fastify'
import fastifyRedis from '@fastify/redis'
import { env } from './config/env.js'
import { db, pool } from './db/client.js'
import routes from './routes/index.js'

export function buildApp() {
  const app = Fastify({ logger: true })

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
