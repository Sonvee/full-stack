import { and, desc, eq, ilike, inArray } from 'drizzle-orm'
import type { FastifyError, FastifyPluginAsync } from 'fastify'
import { DatabaseError } from 'pg'
import { dictionaries } from '../../db/schema.js'
import type {
  DictionaryDeleteParams,
  DictionaryIdParams,
  DictionaryInput,
  DictionaryQueryParams,
  DictionaryUpdateParams,
} from '../../types/dictionary.js'
import dictionaryDataRoutes from './data.js'
import {
  dictionaryDeleteResponseSchema,
  dictionaryDeleteSchema,
  dictionaryInputSchema,
  dictionaryListResponseSchema,
  dictionaryParamsSchema,
  dictionaryQuerySchema,
  dictionaryResponseSchema,
  dictionaryUpdateSchema,
} from './schemas.js'

const dictionaryRoutes: FastifyPluginAsync = async (app) => {
  /** 数据库约束同时处理并发写入，其他异常交给全局错误处理器记录。 */
  app.setErrorHandler<FastifyError>((error, _request, reply) => {
    if (error.cause instanceof DatabaseError) {
      if (error.cause.code === '23505') {
        return reply.code(409).send({ code: 409, message: '字典类型已存在，请使用其他类型标识' })
      }
      if (error.cause.code === '23503') {
        return reply.code(409).send({ code: 409, message: '字典包含数据，请先删除字典数据' })
      }
    }
    throw error
  })

  app.register(dictionaryDataRoutes, { prefix: '/data' })

  app.get<{ Querystring: DictionaryQueryParams }>('/list', {
    schema: { querystring: dictionaryQuerySchema, response: { 200: dictionaryListResponseSchema } },
  }, async (request) => {
    const query = request.query
    const filters = and(
      query.name ? ilike(dictionaries.name, `%${query.name}%`) : undefined,
      query.type ? ilike(dictionaries.type, `%${query.type}%`) : undefined,
      query.status ? eq(dictionaries.status, query.status) : undefined,
    )
    const listQuery = app.db.select().from(dictionaries).where(filters)
      .orderBy(desc(dictionaries.createdAt), desc(dictionaries.id))
    if (query.pageSize !== -1) {
      listQuery.limit(query.pageSize).offset((query.pageNum - 1) * query.pageSize)
    }
    const data = await listQuery
    const total = await app.db.$count(dictionaries, filters)
    return { code: 200, message: '查询成功', data, total }
  })

  app.get<{ Params: DictionaryIdParams }>('/:id', {
    schema: { params: dictionaryParamsSchema, response: { 200: dictionaryResponseSchema } },
  }, async (request, reply) => {
    const [data] = await app.db.select().from(dictionaries).where(eq(dictionaries.id, request.params.id))
    if (!data) {
      return reply.code(404).send({ code: 404, message: '字典不存在或已被删除' })
    }
    return { code: 200, message: '查询成功', data }
  })

  app.post<{ Body: DictionaryInput }>('/add', {
    schema: { body: dictionaryInputSchema, response: { 201: dictionaryResponseSchema } },
  }, async (request, reply) => {
    const [data] = await app.db.insert(dictionaries).values(request.body).returning()
    return reply.code(201).send({ code: 201, message: '新增成功', data })
  })

  app.post<{ Body: DictionaryUpdateParams }>('/update', {
    schema: { body: dictionaryUpdateSchema, response: { 200: dictionaryResponseSchema } },
  }, async (request, reply) => {
    const { id, ...input } = request.body
    const [data] = await app.db.update(dictionaries).set({ ...input, updatedAt: new Date() })
      .where(eq(dictionaries.id, id)).returning()
    if (!data) {
      return reply.code(404).send({ code: 404, message: '字典不存在或已被删除' })
    }
    return { code: 200, message: '修改成功', data }
  })

  app.post<{ Body: DictionaryDeleteParams }>('/delete', {
    schema: { body: dictionaryDeleteSchema, response: { 200: dictionaryDeleteResponseSchema } },
  }, async (request) => {
    // 外键阻止删除非空字典；批量删除是同一条 SQL，不会只删除其中一部分。
    const deleted = await app.db.delete(dictionaries).where(inArray(dictionaries.id, request.body.ids))
      .returning({ id: dictionaries.id })
    return { code: 200, message: '删除成功', data: { deletedCount: deleted.length } }
  })
}

export default dictionaryRoutes
