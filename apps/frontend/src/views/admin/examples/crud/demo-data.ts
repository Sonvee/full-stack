import { fields, type DataRecord, type FormValues } from './data-model'

/** 生成页面演示数据；每次进入页面恢复，所有编辑都只保存在当前页面。 */
export function createDemoRecords(): DataRecord[] {
  return Array.from({ length: 36 }, (_, index) => {
    const values = Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.options
          ? field.options[index % field.options.length]
          : `${field.label}示例 ${String(index + 1).padStart(2, '0')}`,
      ]),
    ) as FormValues
    return {
      ...values,
      id: `R${String(index + 1).padStart(4, '0')}`,
      createdAt: `2026-10-${String((index % 28) + 1).padStart(2, '0')}`,
    }
  })
}
