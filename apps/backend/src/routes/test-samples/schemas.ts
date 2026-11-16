/** 单选、多选字段使用字符串存储，限制值与页面字典保持一致。 */
const singleSelectSchema = { type: 'string', enum: ['选项甲', '选项乙', '选项丙'] }
const multiSelectSchema = {
  type: 'array',
  items: { type: 'string', enum: ['选项甲', '选项乙', '选项丙'] },
  uniqueItems: true,
  maxItems: 3,
}

/** 时间范围固定为 [开始时间, 结束时间]。 */
const dateTimeRangeSchema = {
  type: 'array',
  items: { type: 'string', format: 'date-time' },
  minItems: 2,
  maxItems: 2,
}

const editableProperties = {
  name: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
  description: { type: 'string', maxLength: 2000 },
  icon: { type: 'string', maxLength: 100 },
  number: { type: 'number' },
  index: { type: 'integer', minimum: -2147483648, maximum: 2147483647, description: '排序，数值越小越靠前' },
  enabled: { type: 'boolean' },
  singleSelect: singleSelectSchema,
  multiSelect: multiSelectSchema,
  operator: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
}

export const testSampleInputSchema = {
  type: 'object',
  additionalProperties: false,
  required: Object.keys(editableProperties),
  properties: editableProperties,
}

export const testSampleQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string', maxLength: 100 },
    description: { type: 'string', maxLength: 2000 },
    icon: { type: 'string', maxLength: 100 },
    numberRange: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
    enabled: { type: 'boolean' },
    singleSelect: singleSelectSchema,
    multiSelect: multiSelectSchema,
    operator: { type: 'string', maxLength: 100 },
    createdRange: dateTimeRangeSchema,
    updatedRange: dateTimeRangeSchema,
    pageNum: { type: 'integer', default: 1 },
    pageSize: {
      type: 'integer',
      anyOf: [{ const: -1 }, { minimum: 1, maximum: 100 }],
      default: 10,
      description: '每页条数，-1 表示忽略页码并查询全部匹配数据',
    },
  },
}

export const testSampleUpdateSchema = {
  ...testSampleInputSchema,
  required: ['id', ...testSampleInputSchema.required],
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...editableProperties,
  },
}

export const testSampleDeleteSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['ids'],
  properties: {
    ids: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: { type: 'string', format: 'uuid' },
    },
  },
}

const testSampleSchema = {
  type: 'object',
  required: ['id', ...Object.keys(editableProperties), 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    ...editableProperties,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

const responseProperties = {
  code: { type: 'integer' },
  message: { type: 'string' },
}

export const testSampleResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: { ...responseProperties, data: testSampleSchema },
}

export const testSampleListResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data', 'total'],
  properties: {
    ...responseProperties,
    data: { type: 'array', items: testSampleSchema },
    total: { type: 'integer' },
  },
}

export const testSampleDeleteResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: {
    ...responseProperties,
    data: {
      type: 'object',
      required: ['deletedCount'],
      properties: { deletedCount: { type: 'integer' } },
    },
  },
}
