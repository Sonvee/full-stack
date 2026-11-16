import type { FastifyPluginAsync } from 'fastify'
import healthRoutes from './health/index.js'
import testSampleRoutes from './test-samples/index.js'
import dictRoutes from './dict/index.js'

const routes: FastifyPluginAsync = async (app) => {
  app.register(healthRoutes)
  app.register(testSampleRoutes, { prefix: '/api/test-samples' })
  app.register(dictRoutes, { prefix: '/api/dict' })
}

export default routes
