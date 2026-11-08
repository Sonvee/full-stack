import { fields, type DataRecord, type FormValues } from './data-model'

/**
 * 生成 CRUD 模板使用的示例数据。
 *
 * @remarks
 * 根据共用字段定义生成文本值并循环选取下拉选项，不修改原字段配置。
 * 字段定义须覆盖全部可填写字段，options 存在时须包含至少一个有效选项。
 *
 * @returns 包含 36 条记录的新数组，每条记录具有列表内唯一的编号及示例创建日期。
 */
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
