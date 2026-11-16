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

/** 字典类型，dictType 是业务使用的唯一标识。 */
export const dict = pgTable('dict', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  dictType: varchar('dict_type', { length: 100 }).notNull().unique('dict_type_unique'),
  status: varchar('status', { length: 50 }).notNull().default('1'),
  remark: varchar('remark', { length: 500 }).notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/** 字典数据通过 dictType 关联字典，修改类型标识时同步更新关联值。 */
export const dictDetail = pgTable('dict-detail', {
  id: uuid('id').primaryKey().defaultRandom(),
  dictType: varchar('dict_type', { length: 100 }).notNull()
    .references(() => dict.dictType, { onDelete: 'restrict', onUpdate: 'cascade' }),
  label: varchar('label', { length: 100 }).notNull(),
  value: varchar('value', { length: 100 }).notNull(),
  index: integer('index').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('1'),
  tagType: varchar('tag_type', { length: 10, enum: ['primary', 'success', 'info', 'warning', 'danger'] }).notNull().default('primary'),
  remark: varchar('remark', { length: 500 }).notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique('dict_detail_dict_value_unique').on(table.dictType, table.value),
])
