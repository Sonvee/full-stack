export const dictIdSchema = { type: 'string', format: 'uuid' }

export const dictTypeSchema = { type: 'string', minLength: 1, maxLength: 100, pattern: '^[a-z][a-z0-9_]*$' }

export const dictPaginationProperties = {
  pageNum: { type: 'integer', minimum: 1, maximum: 1000000, default: 1 },
  pageSize: {
    type: 'integer',
    anyOf: [{ const: -1 }, { minimum: 1, maximum: 100 }],
    default: 20,
    description: '-1 表示查询全部匹配数据',
  },
}

const editableProperties = {
  name: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
  dictType: dictTypeSchema,
  status: { type: 'string', minLength: 1, maxLength: 50 },
  remark: { type: 'string', maxLength: 500 },
}

export const dictInputSchema = {
  type: 'object',
  additionalProperties: false,
  required: Object.keys(editableProperties),
  properties: editableProperties,
}

export const dictUpdateSchema = {
  ...dictInputSchema,
  required: ['id', ...dictInputSchema.required],
  properties: { id: dictIdSchema, ...editableProperties },
}

export const dictQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string', maxLength: 100 },
    dictType: { type: 'string', maxLength: 100 },
    status: { type: 'string', maxLength: 50 },
    ...dictPaginationProperties,
  },
}

export const dictParamsSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['dictType'],
  properties: { dictType: dictTypeSchema },
}

export const dictDeleteSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['ids'],
  properties: {
    ids: { type: 'array', minItems: 1, uniqueItems: true, items: dictIdSchema },
  },
}

const dictSchema = {
  type: 'object',
  required: ['id', ...Object.keys(editableProperties), 'createdAt', 'updatedAt'],
  properties: {
    id: dictIdSchema,
    ...editableProperties,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

export const dictResponseProperties = {
  code: { type: 'integer' },
  message: { type: 'string' },
}

export const dictResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: { ...dictResponseProperties, data: dictSchema },
}

export const dictListResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data', 'total'],
  properties: {
    ...dictResponseProperties,
    data: { type: 'array', items: dictSchema },
    total: { type: 'integer' },
  },
}

export const dictDeleteResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: {
    ...dictResponseProperties,
    data: {
      type: 'object',
      required: ['deletedCount'],
      properties: { deletedCount: { type: 'integer' } },
    },
  },
}
