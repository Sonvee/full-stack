import type { dictionaries, dictionaryData } from '../db/schema.js'

export type Dictionary = typeof dictionaries.$inferSelect
export type DictionaryInput = Omit<Dictionary, 'id' | 'createdAt' | 'updatedAt'>
export type DictionaryData = typeof dictionaryData.$inferSelect
export type DictionaryDataInput = Omit<DictionaryData, 'id' | 'createdAt' | 'updatedAt'>

export interface DictionaryQueryParams {
  name?: string
  type?: string
  status?: string
  pageNum: number
  /** -1 表示查询全部匹配数据。 */
  pageSize: number
}

export interface DictionaryDataQueryParams {
  dictionaryId: string
  label?: string
  value?: string
  status?: string
  pageNum: number
  pageSize: number
}

export interface DictionaryIdParams {
  id: string
}

export interface DictionaryDeleteParams {
  ids: string[]
}

export interface DictionaryUpdateParams extends DictionaryInput {
  id: string
}

export interface DictionaryDataUpdateParams extends DictionaryDataInput {
  id: string
}

/** 数据删除必须限定所属字典。 */
export interface DictionaryDataDeleteParams extends DictionaryDeleteParams {
  dictionaryId: string
}
