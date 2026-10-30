import type { FastifyPluginAsync } from 'fastify'
import healthRoutes from './health/index.js'

const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes)
}

export default routes
