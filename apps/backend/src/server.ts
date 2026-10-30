import { buildApp } from './app.js'
import { env } from './config/env.js'

const app = buildApp()

try {
  await app.listen({ port: env.port, host: env.host })
} catch (error) {
  app.log.error(error)
  await app.close().catch((closeError) => app.log.error(closeError))
  process.exitCode = 1
}
