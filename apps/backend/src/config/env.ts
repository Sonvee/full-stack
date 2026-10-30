export const env = {
  host: process.env.HOST ?? '0.0.0.0',
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://root:root1234@localhost:5432/app',
  redisUrl: process.env.REDIS_URL ?? 'redis://:root1234@localhost:6379',
}
