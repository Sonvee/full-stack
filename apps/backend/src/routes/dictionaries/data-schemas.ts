import {
  dictionaryDeleteSchema,
  dictionaryIdSchema,
  dictionaryPaginationProperties,
  dictionaryResponseProperties,
} from './schemas.js'

const editableProperties = {
  dictionaryId: dictionaryIdSchema,
  label: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
  value: { type: 'string', minLength: 1, maxLength: 100, pattern: '\\S' },
  index: { type: 'integer', minimum: 0, maximum: 2147483647 },
  status: { type: 'string', minLength: 1, maxLength: 50 },
  tagType: { type: 'string', enum: ['primary', 'success', 'info', 'warning', 'danger'] },
  remark: { type: 'string', maxLength: 500 },
}

export const dictionaryDataInputSchema = {
  type: 'object',
  additionalProperties: false,
  required: Object.keys(editableProperties),
  properties: editableProperties,
}

export const dictionaryDataUpdateSchema = {
  ...dictionaryDataInputSchema,
  required: ['id', ...dictionaryDataInputSchema.required],
  properties: { id: dictionaryIdSchema, ...editableProperties },
}

export const dictionaryDataQuerySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['dictionaryId'],
  properties: {
    dictionaryId: dictionaryIdSchema,
    label: { type: 'string', maxLength: 100 },
    value: { type: 'string', maxLength: 100 },
    status: { type: 'string', maxLength: 50 },
    ...dictionaryPaginationProperties,
  },
}

export const dictionaryDataDeleteSchema = {
  ...dictionaryDeleteSchema,
  required: ['dictionaryId', ...dictionaryDeleteSchema.required],
  properties: { dictionaryId: dictionaryIdSchema, ...dictionaryDeleteSchema.properties },
}

const dictionaryDataSchema = {
  type: 'object',
  required: ['id', ...Object.keys(editableProperties), 'createdAt', 'updatedAt'],
  properties: {
    id: dictionaryIdSchema,
    ...editableProperties,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

export const dictionaryDataResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data'],
  properties: { ...dictionaryResponseProperties, data: dictionaryDataSchema },
}

export const dictionaryDataListResponseSchema = {
  type: 'object',
  required: ['code', 'message', 'data', 'total'],
  properties: {
    ...dictionaryResponseProperties,
    data: { type: 'array', items: dictionaryDataSchema },
    total: { type: 'integer' },
  },
}
