import {
  dictDeleteSchema,
  dictIdSchema,
  dictPaginationProperties,
  dictResponseProperties,
  dictTypeSchema,
} from '../schemas.js'

const editableProperties = {
  dictType: dictTypeSchema,
  label: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
  value: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
  index: { type: 'integer', minimum: 0, maximum: 2147483647 },
  status: { type: 'string', minLength: 1, maxLength: 50 },
  tagType: { type: 'string', enum: ['primary', 'success', 'info', 'warning', 'danger'] },
  remark: { type: 'string', maxLength: 500 },
}

export const dictDetailInputSchema = {
  type: 'object',
  additionalProperties: false,
  required: Object.keys(editableProperties),
  properties: editableProperties,
}

export const dictDetailUpdateSchema = {
  ...dictDetailInputSchema,
  required: ['id', ...dictDetailInputSchema.required],
  properties: { id: dictIdSchema, ...editableProperties },
}

export const dictDetailQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    label: { type: 'string', maxLength: 100 },
    value: { type: 'string', maxLength: 100 },
    status: { type: 'string', maxLength: 50 },
    ...dictPaginationProperties,
  },
}

export const dictDetailDeleteSchema = {
  ...dictDeleteSchema,
  required: ['dictType', ...dictDeleteSchema.required],
  properties: { dictType: dictTypeSchema, ...dictDeleteSchema.properties },
}

const dictDetailSchema = {
  type: 'object',
  required: ['id', ...Object.keys(editableProperties), 'createdAt', 'updatedAt'],
  properties: {
    id: dictIdSchema,
    ...editableProperties,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

export const dictDetailCacheResponseSchema = {
  type: 'object',
  required: ['code', 'message'],
  properties: dictResponseProperties,
}

export const dictDetailResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: { ...dictResponseProperties, data: dictDetailSchema },
}

export const dictDetailListResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data', 'total'],
  properties: {
    ...dictResponseProperties,
    data: { type: 'array', items: dictDetailSchema },
    total: { type: 'integer' },
  },
}
