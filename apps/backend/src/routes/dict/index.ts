import { and, desc, eq, ilike, inArray } from 'drizzle-orm'
import type { FastifyError, FastifyPluginAsync } from 'fastify'
import { DatabaseError } from 'pg'
import { dict } from '../../db/schema.js'
import type {
  DictDeleteParams,
  DictTypeParams,
  DictInput,
  DictQueryParams,
  DictUpdateParams,
} from '../../types/dict.js'
import dictDetailRoutes from './dict-detail/index.js'
import {
  dictDeleteResponseSchema,
  dictDeleteSchema,
  dictInputSchema,
  dictListResponseSchema,
  dictParamsSchema,
  dictQuerySchema,
  dictResponseSchema,
  dictUpdateSchema,
} from './schemas.js'

const dictRoutes: FastifyPluginAsync = async (app) => {
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

  app.register(dictDetailRoutes, { prefix: '/dict-detail' })

  app.get<{ Querystring: DictQueryParams }>('/list', {
    schema: { querystring: dictQuerySchema, response: { 200: dictListResponseSchema } },
  }, async (request) => {
    const query = request.query
    const filters = and(
      query.name ? ilike(dict.name, `%${query.name}%`) : undefined,
      query.dictType ? ilike(dict.dictType, `%${query.dictType}%`) : undefined,
      query.status ? eq(dict.status, query.status) : undefined,
    )
    const listQuery = app.db.select().from(dict).where(filters)
      .orderBy(desc(dict.createdAt), desc(dict.id))
    if (query.pageSize !== -1) {
      listQuery.limit(query.pageSize).offset((query.pageNum - 1) * query.pageSize)
    }
    const data = await listQuery
    const total = await app.db.$count(dict, filters)
    return { code: 200, message: '查询成功', data, total }
  })

  app.get<{ Params: DictTypeParams }>('/type/:dictType', {
    schema: { params: dictParamsSchema, response: { 200: dictResponseSchema } },
  }, async (request, reply) => {
    const [data] = await app.db.select().from(dict).where(eq(dict.dictType, request.params.dictType))
    if (!data) {
      return reply.code(404).send({ code: 404, message: '字典不存在或已被删除' })
    }
    return { code: 200, message: '查询成功', data }
  })

  app.post<{ Body: DictInput }>('/add', {
    schema: { body: dictInputSchema, response: { 201: dictResponseSchema } },
  }, async (request, reply) => {
    const [data] = await app.db.insert(dict).values(request.body).returning()
    return reply.code(201).send({ code: 201, message: '新增成功', data })
  })

  app.post<{ Body: DictUpdateParams }>('/update', {
    schema: { body: dictUpdateSchema, response: { 200: dictResponseSchema } },
  }, async (request, reply) => {
    const { id, ...input } = request.body
    const [data] = await app.db.update(dict).set({ ...input, updatedAt: new Date() })
      .where(eq(dict.id, id)).returning()
    if (!data) {
      return reply.code(404).send({ code: 404, message: '字典不存在或已被删除' })
    }
    return { code: 200, message: '修改成功', data }
  })

  app.post<{ Body: DictDeleteParams }>('/delete', {
    schema: { body: dictDeleteSchema, response: { 200: dictDeleteResponseSchema } },
  }, async (request) => {
    // 外键阻止删除非空字典；批量删除是同一条 SQL，不会只删除其中一部分。
    const deleted = await app.db.delete(dict).where(inArray(dict.id, request.body.ids))
      .returning({ id: dict.id })
    return { code: 200, message: '删除成功', data: { deletedCount: deleted.length } }
  })
}

export default dictRoutes
