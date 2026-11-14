import {
  boolean,
  doublePrecision,
  pgTable,
  text,
  timestamp,
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
  enabled: boolean('enabled').notNull().default(false),
  singleSelect: varchar('single_select', { length: 50 }).notNull(),
  multiSelect: text('multi_select').array().notNull().default([]),
  operator: varchar('operator', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
