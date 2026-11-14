import { and, arrayContains, asc, between, desc, eq, ilike, inArray } from 'drizzle-orm'
import type { FastifyPluginAsync } from 'fastify'
import { testSamples } from '../../db/schema.js'
import type {
  TestSample,
  TestSampleDeleteParams,
  TestSampleInput,
  TestSampleQueryParams,
  TestSampleUpdateParams,
} from '../../types/test-sample.js'
import {
  testSampleDeleteResponseSchema,
  testSampleDeleteSchema,
  testSampleInputSchema,
  testSampleListResponseSchema,
  testSampleQuerySchema,
  testSampleResponseSchema,
  testSampleUpdateSchema,
} from './schemas.js'

/** 数据库日期统一转换为 Unix 毫秒时间戳，供接口返回。 */
function serializeTestSample(data: TestSample) {
  return {
    ...data,
    createdAt: data.createdAt.getTime(),
    updatedAt: data.updatedAt.getTime(),
  }
}

const testSampleRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Querystring: TestSampleQueryParams }>(
    '/list',
    {
      schema: {
        querystring: testSampleQuerySchema,
        response: { 200: testSampleListResponseSchema },
      },
    },
    async (request, reply) => {
      const query = request.query
      // 全量查询忽略页码，普通分页仍限制有效页码范围。
      if (query.pageSize !== -1 && (query.pageNum < 1 || query.pageNum > 1000000)) {
        return reply.code(400).send({ code: 400, message: '页码必须在 1 到 1000000 之间' })
      }
      if (
        query.numberRange &&
        query.numberRange[0] > query.numberRange[1]
      ) {
        return reply.code(400).send({ code: 400, message: '数字下限不能大于上限' })
      }
      if (
        (query.createdRange && query.createdRange[0] > query.createdRange[1]) ||
        (query.updatedRange && query.updatedRange[0] > query.updatedRange[1])
      ) {
        return reply.code(400).send({ code: 400, message: '开始时间不能晚于结束时间' })
      }

      // 时间范围使用毫秒时间戳，包含开始和结束边界。
      const filters = and(
        query.name ? ilike(testSamples.name, `%${query.name}%`) : undefined,
        query.description ? ilike(testSamples.description, `%${query.description}%`) : undefined,
        query.icon ? ilike(testSamples.icon, `%${query.icon}%`) : undefined,
        query.numberRange
          ? between(testSamples.number, query.numberRange[0], query.numberRange[1])
          : undefined,
        query.enabled !== undefined ? eq(testSamples.enabled, query.enabled) : undefined,
        query.singleSelect ? eq(testSamples.singleSelect, query.singleSelect) : undefined,
        query.multiSelect?.length
          ? arrayContains(testSamples.multiSelect, query.multiSelect)
          : undefined,
        query.operator ? ilike(testSamples.operator, `%${query.operator}%`) : undefined,
        query.createdRange
          ? between(testSamples.createdAt, new Date(query.createdRange[0]), new Date(query.createdRange[1]))
          : undefined,
        query.updatedRange
          ? between(testSamples.updatedAt, new Date(query.updatedRange[0]), new Date(query.updatedRange[1]))
          : undefined,
      )

      const listQuery = app.db
        .select()
        .from(testSamples)
        .where(filters)
        .orderBy(asc(testSamples.index), desc(testSamples.createdAt), desc(testSamples.id))
      if (query.pageSize !== -1) {
        listQuery.limit(query.pageSize).offset((query.pageNum - 1) * query.pageSize)
      }
      const data = await listQuery
      const total = await app.db.$count(testSamples, filters)
      return { code: 200, message: '查询成功', data: data.map(serializeTestSample), total }
    },
  )

  app.post<{ Body: TestSampleInput }>(
    '/add',
    {
      schema: { body: testSampleInputSchema, response: { 201: testSampleResponseSchema } },
    },
    async (request, reply) => {
      const [data] = await app.db.insert(testSamples).values(request.body).returning()
      return reply.code(201).send({ code: 201, message: '新增成功', data: serializeTestSample(data) })
    },
  )

  app.post<{ Body: TestSampleUpdateParams }>(
    '/update',
    {
      schema: {
        body: testSampleUpdateSchema,
        response: { 200: testSampleResponseSchema },
      },
    },
    async (request, reply) => {
      const { id, ...input } = request.body
      const [data] = await app.db
        .update(testSamples)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(testSamples.id, id))
        .returning()
      if (!data) {
        return reply.code(404).send({ code: 404, message: '测试样例不存在或已被删除' })
      }
      return { code: 200, message: '修改成功', data: serializeTestSample(data) }
    },
  )

  app.post<{ Body: TestSampleDeleteParams }>(
    '/delete',
    {
      schema: { body: testSampleDeleteSchema, response: { 200: testSampleDeleteResponseSchema } },
    },
    async (request) => {
      const deleted = await app.db
        .delete(testSamples)
        .where(inArray(testSamples.id, request.body.ids))
        .returning({ id: testSamples.id })
      return { code: 200, message: '删除成功', data: { deletedCount: deleted.length } }
    },
  )
}

export default testSampleRoutes
