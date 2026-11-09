import type { DemoFormValues, DemoListParams, DemoListResponse } from '@/types/demo'

/** 查询 CRUD 示例列表。 */
export async function apiDemoList(_params: DemoListParams): Promise<DemoListResponse> {
  return {
    code: 200,
    data: [
    {
      id: 'R0001',
      aInput: '数据项甲示例 01',
      bInput: '数据项乙示例 01',
      cInput: '数据项丙示例 01',
      dSelect: '选项甲',
      eSelect: '选项甲',
      fSelect: '选项甲',
      gSelect: '选项甲',
      createdAt: '2026-10-01',
    },
    {
      id: 'R0002',
      aInput: '数据项甲示例 02',
      bInput: '数据项乙示例 02',
      cInput: '数据项丙示例 02',
      dSelect: '选项乙',
      eSelect: '选项乙',
      fSelect: '选项乙',
      gSelect: '选项乙',
      createdAt: '2026-10-02',
    },
    {
      id: 'R0003',
      aInput: '数据项甲示例 03',
      bInput: '数据项乙示例 03',
      cInput: '数据项丙示例 03',
      dSelect: '选项丙',
      eSelect: '选项丙',
      fSelect: '选项甲',
      gSelect: '选项丙',
      createdAt: '2026-10-03',
    },
    {
      id: 'R0004',
      aInput: '数据项甲示例 04',
      bInput: '数据项乙示例 04',
      cInput: '数据项丙示例 04',
      dSelect: '选项丁',
      eSelect: '选项甲',
      fSelect: '选项乙',
      gSelect: '选项甲',
      createdAt: '2026-10-04',
    },
    {
      id: 'R0005',
      aInput: '数据项甲示例 05',
      bInput: '数据项乙示例 05',
      cInput: '数据项丙示例 05',
      dSelect: '选项甲',
      eSelect: '选项乙',
      fSelect: '选项甲',
      gSelect: '选项乙',
      createdAt: '2026-10-05',
    },
    {
      id: 'R0006',
      aInput: '数据项甲示例 06',
      bInput: '数据项乙示例 06',
      cInput: '数据项丙示例 06',
      dSelect: '选项乙',
      eSelect: '选项丙',
      fSelect: '选项乙',
      gSelect: '选项丙',
      createdAt: '2026-10-06',
    },
    {
      id: 'R0007',
      aInput: '数据项甲示例 07',
      bInput: '数据项乙示例 07',
      cInput: '数据项丙示例 07',
      dSelect: '选项丙',
      eSelect: '选项甲',
      fSelect: '选项甲',
      gSelect: '选项甲',
      createdAt: '2026-10-07',
    },
    {
      id: 'R0008',
      aInput: '数据项甲示例 08',
      bInput: '数据项乙示例 08',
      cInput: '数据项丙示例 08',
      dSelect: '选项丁',
      eSelect: '选项乙',
      fSelect: '选项乙',
      gSelect: '选项丙',
      createdAt: '2026-10-08',
    },
    ],
    message: '请求成功',
    total: 8,
  }
}

/** 提交 CRUD 示例新增请求的占位 API。 */
export function apiDemoAdd(values: DemoFormValues): void {
  console.log('新增数据', values)
}

/** 提交 CRUD 示例修改请求的占位 API。 */
export function apiDemoUpdate(id: string, values: DemoFormValues): void {
  console.log('修改数据', id, values)
}

/** 提交 CRUD 示例删除请求的占位 API。 */
export function apiDemoDelete(ids: string[]): void {
  console.log('删除数据', ids)
}

/** 提交 CRUD 示例导入请求的占位 API。 */
export function apiDemoImport(): void {
  console.log('导入数据')
}

/** 提交 CRUD 示例导出请求的占位 API。 */
export function apiDemoExport(): void {
  console.log('导出数据')
}
