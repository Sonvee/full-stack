import { and, asc, desc, eq, ilike, inArray } from 'drizzle-orm'
import type { FastifyError, FastifyPluginAsync } from 'fastify'
import { DatabaseError } from 'pg'
import { dictionaryData } from '../../db/schema.js'
import type {
  DictionaryDataDeleteParams,
  DictionaryDataInput,
  DictionaryDataQueryParams,
  DictionaryDataUpdateParams,
} from '../../types/dictionary.js'
import {
  dictionaryDataDeleteSchema,
  dictionaryDataInputSchema,
  dictionaryDataListResponseSchema,
  dictionaryDataQuerySchema,
  dictionaryDataResponseSchema,
  dictionaryDataUpdateSchema,
} from './data-schemas.js'
import { dictionaryDeleteResponseSchema } from './schemas.js'

const dictionaryDataRoutes: FastifyPluginAsync = async (app) => {
  app.setErrorHandler<FastifyError>((error, _request, reply) => {
    if (error.cause instanceof DatabaseError) {
      if (error.cause.code === '23505') {
        return reply.code(409).send({ code: 409, message: '当前字典中已存在相同键值' })
      }
      if (error.cause.code === '23503') {
        return reply.code(409).send({ code: 409, message: '所属字典不存在或已被删除' })
      }
    }
    throw error
  })

  app.get<{ Querystring: DictionaryDataQueryParams }>('/list', {
    schema: { querystring: dictionaryDataQuerySchema, response: { 200: dictionaryDataListResponseSchema } },
  }, async (request) => {
    const query = request.query
    const filters = and(
      eq(dictionaryData.dictionaryId, query.dictionaryId),
      query.label ? ilike(dictionaryData.label, `%${query.label}%`) : undefined,
      query.value ? ilike(dictionaryData.value, `%${query.value}%`) : undefined,
      query.status ? eq(dictionaryData.status, query.status) : undefined,
    )
    const listQuery = app.db.select().from(dictionaryData).where(filters)
      .orderBy(asc(dictionaryData.index), desc(dictionaryData.createdAt), desc(dictionaryData.id))
    if (query.pageSize !== -1) {
      listQuery.limit(query.pageSize).offset((query.pageNum - 1) * query.pageSize)
    }
    const data = await listQuery
    const total = await app.db.$count(dictionaryData, filters)
    return { code: 200, message: '查询成功', data, total }
  })

  app.post<{ Body: DictionaryDataInput }>('/add', {
    schema: { body: dictionaryDataInputSchema, response: { 201: dictionaryDataResponseSchema } },
  }, async (request, reply) => {
    const [data] = await app.db.insert(dictionaryData).values(request.body).returning()
    return reply.code(201).send({ code: 201, message: '新增成功', data })
  })

  app.post<{ Body: DictionaryDataUpdateParams }>('/update', {
    schema: { body: dictionaryDataUpdateSchema, response: { 200: dictionaryDataResponseSchema } },
  }, async (request, reply) => {
    const { id, ...input } = request.body
    const [data] = await app.db.update(dictionaryData).set({ ...input, updatedAt: new Date() })
      .where(and(eq(dictionaryData.id, id), eq(dictionaryData.dictionaryId, input.dictionaryId))).returning()
    if (!data) {
      return reply.code(404).send({ code: 404, message: '字典数据不存在或已被删除' })
    }
    return { code: 200, message: '修改成功', data }
  })

  app.post<{ Body: DictionaryDataDeleteParams }>('/delete', {
    schema: { body: dictionaryDataDeleteSchema, response: { 200: dictionaryDeleteResponseSchema } },
  }, async (request) => {
    const deleted = await app.db.delete(dictionaryData).where(and(
      eq(dictionaryData.dictionaryId, request.body.dictionaryId),
      inArray(dictionaryData.id, request.body.ids),
    )).returning({ id: dictionaryData.id })
    return { code: 200, message: '删除成功', data: { deletedCount: deleted.length } }
  })
}

export default dictionaryDataRoutes
