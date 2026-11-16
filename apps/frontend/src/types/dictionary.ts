import type { DictOption } from './dict'

/** 字典类型列表与新增、修改表单共用的数据。 */
export interface DictionaryListItem {
  id?: string
  name: string
  /** 小写字母开头，只包含小写字母、数字和下划线。 */
  type: string
  status: string
  remark: string
  createdAt?: string
  updatedAt?: string
}

export interface DictionaryQueryParams {
  name?: string
  type?: string
  status?: string
  pageNum: number
  pageSize: number
}

/** 字典详情中的数据项，键值统一以字符串保存。 */
export interface DictionaryDataListItem {
  id?: string
  dictionaryId: string
  label: string
  value: string
  index: number
  status: string
  tagType: NonNullable<DictOption['type']>
  remark: string
  createdAt?: string
  updatedAt?: string
}

export interface DictionaryDataQueryParams {
  dictionaryId: string
  label?: string
  value?: string
  status?: string
  pageNum: number
  pageSize: number
}
