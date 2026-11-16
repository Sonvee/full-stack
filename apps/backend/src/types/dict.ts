import type { dict, dictDetail } from '../db/schema.js'

export type Dict = typeof dict.$inferSelect
export type DictInput = Omit<Dict, 'id' | 'createdAt' | 'updatedAt'>
export type DictDetail = typeof dictDetail.$inferSelect
export type DictDetailInput = Omit<DictDetail, 'id' | 'createdAt' | 'updatedAt'>

export interface DictQueryParams {
  name?: string
  dictType?: string
  status?: string
  pageNum: number
  /** -1 表示查询全部匹配数据。 */
  pageSize: number
}

export interface DictDetailQueryParams {
  label?: string
  value?: string
  status?: string
  pageNum: number
  pageSize: number
}

export interface DictTypeParams {
  dictType: string
}

export interface DictDeleteParams {
  ids: string[]
}

export interface DictUpdateParams extends DictInput {
  id: string
}

export interface DictDetailUpdateParams extends DictDetailInput {
  id: string
}

/** 数据删除必须限定所属字典。 */
export interface DictDetailDeleteParams extends DictDeleteParams {
  dictType: string
}
