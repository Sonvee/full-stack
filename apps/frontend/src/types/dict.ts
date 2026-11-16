/** 通用字典选项。 */
export interface DictOption {
  label: string
  value: string | boolean
  /** 字典标签的样式类型。 */
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
}

/** 字典类型列表与新增、修改表单共用的数据。 */
export interface DictListItem {
  id?: string
  name: string
  /** 小写字母开头，只包含小写字母、数字和下划线。 */
  dictType: string
  status: string
  remark: string
  createdAt?: string
  updatedAt?: string
}

export interface DictQueryParams {
  name?: string
  dictType?: string
  status?: string
  pageNum: number
  pageSize: number
}

/** 字典详情中的数据项，键值统一以字符串保存。 */
export interface DictDetailListItem {
  id?: string
  dictType: string
  label: string
  value: string
  index: number
  status: string
  tagType: NonNullable<DictOption['type']>
  remark: string
  createdAt?: string
  updatedAt?: string
}

export interface DictDetailQueryParams {
  dictType: string
  label?: string
  value?: string
  status?: string
  pageNum: number
  pageSize: number
}
