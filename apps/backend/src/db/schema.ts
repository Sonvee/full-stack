import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

/** 测试样例，覆盖字符串、数字、布尔值、数组及日期时间字段。 */
export const testSamples = pgTable('test_samples', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull().default(''),
  icon: varchar('icon', { length: 100 }).notNull().default(''),
  number: doublePrecision('number').notNull().default(0),
  index: integer('index').notNull().default(0),
  enabled: boolean('enabled').notNull().default(false),
  singleSelect: varchar('single_select', { length: 50 }).notNull(),
  multiSelect: text('multi_select').array().notNull().default([]),
  operator: varchar('operator', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/** 字典类型，type 是业务使用的唯一标识。 */
export const dictionaries = pgTable('dictionaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 100 }).notNull().unique('dictionaries_type_unique'),
  status: varchar('status', { length: 50 }).notNull().default('1'),
  remark: varchar('remark', { length: 500 }).notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/** 字典数据通过编号关联类型，修改类型标识不会影响所属数据。 */
export const dictionaryData = pgTable('dictionary_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  dictionaryId: uuid('dictionary_id').notNull().references(() => dictionaries.id, { onDelete: 'restrict' }),
  label: varchar('label', { length: 100 }).notNull(),
  value: varchar('value', { length: 100 }).notNull(),
  index: integer('index').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('1'),
  tagType: varchar('tag_type', { length: 10, enum: ['primary', 'success', 'info', 'warning', 'danger'] }).notNull().default('primary'),
  remark: varchar('remark', { length: 500 }).notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique('dictionary_data_dictionary_value_unique').on(table.dictionaryId, table.value),
])
