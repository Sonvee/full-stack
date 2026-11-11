import { delay } from 'es-toolkit'
import type { DemoListItem, DemoQueryParams, DemoApiResponse } from '@/types/demo'

/** 查询 CRUD 示例列表。 */
export async function apiDemoList(params: DemoQueryParams): Promise<DemoApiResponse> {
  await delay(1000)
  console.log('查询数据', params)
  return {
    code: 200,
    data: [
    {
      id: 'R0001',
      aInput: '数据项甲示例 01',
      bInput: '数据项乙示例 01',
      cInput: '数据项丙示例 01',
      dSelect: '选项甲',
      eSelect: ['选项甲'],
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
      eSelect: ['选项乙'],
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
      eSelect: ['选项丙'],
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
      eSelect: ['选项甲'],
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
      eSelect: ['选项乙'],
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
      eSelect: ['选项丙'],
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
      eSelect: ['选项甲'],
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
      eSelect: ['选项乙'],
      fSelect: '选项乙',
      gSelect: '选项丙',
      createdAt: '2026-10-08',
    },
    {
      id: 'R0009',
      aInput: '数据项甲示例 09',
      bInput: '数据项乙示例 09',
      cInput: '数据项丙示例 09',
      dSelect: '选项甲',
      eSelect: ['选项丙'],
      fSelect: '选项甲',
      gSelect: '选项丙',
      createdAt: '2026-10-09',
    },
    {
      id: 'R0010',
      aInput: '数据项甲示例 10',
      bInput: '数据项乙示例 10',
      cInput: '数据项丙示例 10',
      dSelect: '选项乙',
      eSelect: ['选项甲'],
      fSelect: '选项乙',
      gSelect: '选项甲',
      createdAt: '2026-10-10',
    },
    {
      id: 'R0011',
      aInput: '数据项甲示例 11',
      bInput: '数据项乙示例 11',
      cInput: '数据项丙示例 11',
      dSelect: '选项丙',
      eSelect: ['选项乙'],
      fSelect: '选项甲',
      gSelect: '选项乙',
      createdAt: '2026-10-11',
    },
    {
      id: 'R0012',
      aInput: '数据项甲示例 12',
      bInput: '数据项乙示例 12',
      cInput: '数据项丙示例 12',
      dSelect: '选项丁',
      eSelect: ['选项丙'],
      fSelect: '选项乙',
      gSelect: '选项丙',
      createdAt: '2026-10-12',
    },
    {
      id: 'R0013',
      aInput: '数据项甲示例 13',
      bInput: '数据项乙示例 13',
      cInput: '数据项丙示例 13',
      dSelect: '选项甲',
      eSelect: ['选项甲'],
      fSelect: '选项甲',
      gSelect: '选项甲',
      createdAt: '2026-10-13',
    },
    {
      id: 'R0014',
      aInput: '数据项甲示例 14',
      bInput: '数据项乙示例 14',
      cInput: '数据项丙示例 14',
      dSelect: '选项乙',
      eSelect: ['选项乙'],
      fSelect: '选项乙',
      gSelect: '选项乙',
      createdAt: '2026-10-14',
    },
    {
      id: 'R0015',
      aInput: '数据项甲示例 15',
      bInput: '数据项乙示例 15',
      cInput: '数据项丙示例 15',
      dSelect: '选项丙',
      eSelect: ['选项丙'],
      fSelect: '选项甲',
      gSelect: '选项丙',
      createdAt: '2026-10-15',
    },
    {
      id: 'R0016',
      aInput: '数据项甲示例 16',
      bInput: '数据项乙示例 16',
      cInput: '数据项丙示例 16',
      dSelect: '选项丁',
      eSelect: ['选项甲'],
      fSelect: '选项乙',
      gSelect: '选项甲',
      createdAt: '2026-10-16',
    },
    {
      id: 'R0017',
      aInput: '数据项甲示例 17',
      bInput: '数据项乙示例 17',
      cInput: '数据项丙示例 17',
      dSelect: '选项甲',
      eSelect: ['选项乙'],
      fSelect: '选项甲',
      gSelect: '选项乙',
      createdAt: '2026-10-17',
    },
    {
      id: 'R0018',
      aInput: '数据项甲示例 18',
      bInput: '数据项乙示例 18',
      cInput: '数据项丙示例 18',
      dSelect: '选项乙',
      eSelect: ['选项丙'],
      fSelect: '选项乙',
      gSelect: '选项丙',
      createdAt: '2026-10-18',
    },
    {
      id: 'R0019',
      aInput: '数据项甲示例 19',
      bInput: '数据项乙示例 19',
      cInput: '数据项丙示例 19',
      dSelect: '选项丙',
      eSelect: ['选项甲'],
      fSelect: '选项甲',
      gSelect: '选项甲',
      createdAt: '2026-10-19',
    },
    {
      id: 'R0020',
      aInput: '数据项甲示例 20',
      bInput: '数据项乙示例 20',
      cInput: '数据项丙示例 20',
      dSelect: '选项丁',
      eSelect: ['选项乙'],
      fSelect: '选项乙',
      gSelect: '选项乙',
      createdAt: '2026-10-20',
    },
    {
      id: 'R0021',
      aInput: '数据项甲示例 21',
      bInput: '数据项乙示例 21',
      cInput: '数据项丙示例 21',
      dSelect: '选项甲',
      eSelect: ['选项丙'],
      fSelect: '选项甲',
      gSelect: '选项丙',
      createdAt: '2026-10-21',
    },
    {
      id: 'R0022',
      aInput: '数据项甲示例 22',
      bInput: '数据项乙示例 22',
      cInput: '数据项丙示例 22',
      dSelect: '选项乙',
      eSelect: ['选项甲'],
      fSelect: '选项乙',
      gSelect: '选项甲',
      createdAt: '2026-10-22',
    },
    ],
    message: '请求成功',
    total: 22,
  }
}

/** 提交 CRUD 示例新增请求的占位 API。 */
export async function apiDemoAdd(data: DemoListItem): Promise<void> {
  await delay(1000)
  console.log('新增数据', data)
}

/** 提交 CRUD 示例修改请求的占位 API。 */
export async function apiDemoUpdate(data: DemoListItem): Promise<void> {
  await delay(1000)
  console.log('修改数据', data)
}

/** 提交 CRUD 示例删除请求的占位 API。 */
export async function apiDemoDelete(): Promise<void> {
  await delay(1000)
  console.log('删除数据')
}

/** 提交 CRUD 示例导入请求的占位 API。 */
export async function apiDemoImport(): Promise<void> {
  await delay(1000)
  console.log('导入数据')
}

/** 提交 CRUD 示例导出请求的占位 API。 */
export async function apiDemoExport(): Promise<void> {
  await delay(1000)
  console.log('导出数据')
}
