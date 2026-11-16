import { and, asc, desc, eq, ilike, inArray } from 'drizzle-orm'
import type { FastifyError, FastifyPluginAsync } from 'fastify'
import { DatabaseError } from 'pg'
import { dictDetail } from '../../../db/schema.js'
import type {
  DictDetailDeleteParams,
  DictDetailInput,
  DictDetailQueryParams,
  DictDetailUpdateParams,
  DictTypeParams,
} from '../../../types/dict.js'
import {
  dictDetailDeleteSchema,
  dictDetailInputSchema,
  dictDetailListResponseSchema,
  dictDetailQuerySchema,
  dictDetailResponseSchema,
  dictDetailUpdateSchema,
} from './schemas.js'
import { dictDeleteResponseSchema, dictParamsSchema } from '../schemas.js'

const dictDetailRoutes: FastifyPluginAsync = async (app) => {
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

  app.get<{ Params: DictTypeParams; Querystring: DictDetailQueryParams }>('/:dictType', {
    schema: { params: dictParamsSchema, querystring: dictDetailQuerySchema, response: { 200: dictDetailListResponseSchema } },
  }, async (request) => {
    const query = request.query
    const filters = and(
      eq(dictDetail.dictType, request.params.dictType),
      query.label ? ilike(dictDetail.label, `%${query.label}%`) : undefined,
      query.value ? ilike(dictDetail.value, `%${query.value}%`) : undefined,
      query.status ? eq(dictDetail.status, query.status) : undefined,
    )
    const listQuery = app.db.select().from(dictDetail).where(filters)
      .orderBy(asc(dictDetail.index), desc(dictDetail.createdAt), desc(dictDetail.id))
    if (query.pageSize !== -1) {
      listQuery.limit(query.pageSize).offset((query.pageNum - 1) * query.pageSize)
    }
    const data = await listQuery
    const total = await app.db.$count(dictDetail, filters)
    return { code: 200, message: '查询成功', data, total }
  })

  app.post<{ Body: DictDetailInput }>('/add', {
    schema: { body: dictDetailInputSchema, response: { 201: dictDetailResponseSchema } },
  }, async (request, reply) => {
    const [data] = await app.db.insert(dictDetail).values(request.body).returning()
    return reply.code(201).send({ code: 201, message: '新增成功', data })
  })

  app.post<{ Body: DictDetailUpdateParams }>('/update', {
    schema: { body: dictDetailUpdateSchema, response: { 200: dictDetailResponseSchema } },
  }, async (request, reply) => {
    const { id, ...input } = request.body
    const [data] = await app.db.update(dictDetail).set({ ...input, updatedAt: new Date() })
      .where(and(eq(dictDetail.id, id), eq(dictDetail.dictType, input.dictType))).returning()
    if (!data) {
      return reply.code(404).send({ code: 404, message: '字典数据不存在或已被删除' })
    }
    return { code: 200, message: '修改成功', data }
  })

  app.post<{ Body: DictDetailDeleteParams }>('/delete', {
    schema: { body: dictDetailDeleteSchema, response: { 200: dictDeleteResponseSchema } },
  }, async (request) => {
    const deleted = await app.db.delete(dictDetail).where(and(
      eq(dictDetail.dictType, request.body.dictType),
      inArray(dictDetail.id, request.body.ids),
    )).returning({ id: dictDetail.id })
    return { code: 200, message: '删除成功', data: { deletedCount: deleted.length } }
  })
}

export default dictDetailRoutes
