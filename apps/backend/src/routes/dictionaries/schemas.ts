export const dictionaryIdSchema = { type: 'string', format: 'uuid' }

export const dictionaryPaginationProperties = {
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
  type: { type: 'string', minLength: 1, maxLength: 100, pattern: '^[a-z][a-z0-9_]*$' },
  status: { type: 'string', minLength: 1, maxLength: 50 },
  remark: { type: 'string', maxLength: 500 },
}

export const dictionaryInputSchema = {
  type: 'object',
  additionalProperties: false,
  required: Object.keys(editableProperties),
  properties: editableProperties,
}

export const dictionaryUpdateSchema = {
  ...dictionaryInputSchema,
  required: ['id', ...dictionaryInputSchema.required],
  properties: { id: dictionaryIdSchema, ...editableProperties },
}

export const dictionaryQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string', maxLength: 100 },
    type: { type: 'string', maxLength: 100 },
    status: { type: 'string', maxLength: 50 },
    ...dictionaryPaginationProperties,
  },
}

export const dictionaryParamsSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: { id: dictionaryIdSchema },
}

export const dictionaryDeleteSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['ids'],
  properties: {
    ids: { type: 'array', minItems: 1, uniqueItems: true, items: dictionaryIdSchema },
  },
}

const dictionarySchema = {
  type: 'object',
  required: ['id', ...Object.keys(editableProperties), 'createdAt', 'updatedAt'],
  properties: {
    id: dictionaryIdSchema,
    ...editableProperties,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

export const dictionaryResponseProperties = {
  code: { type: 'integer' },
  message: { type: 'string' },
}

export const dictionaryResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: { ...dictionaryResponseProperties, data: dictionarySchema },
}

export const dictionaryListResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data', 'total'],
  properties: {
    ...dictionaryResponseProperties,
    data: { type: 'array', items: dictionarySchema },
    total: { type: 'integer' },
  },
}

export const dictionaryDeleteResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: {
    ...dictionaryResponseProperties,
    data: {
      type: 'object',
      required: ['deletedCount'],
      properties: { deletedCount: { type: 'integer' } },
    },
  },
}
