import type { FastifyPluginAsync } from 'fastify'
import healthRoutes from './health/index.js'
import testSampleRoutes from './test-samples/index.js'

const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes)
  app.register(testSampleRoutes, { prefix: '/api/test-samples' })
}

export default routes
