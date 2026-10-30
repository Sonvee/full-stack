import Fastify from 'fastify'
import routes from './routes/index.js'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(routes)

  return app
}
