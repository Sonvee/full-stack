import type { VNode } from 'vue'

/** 单元格插槽参数；$index 是原始数据数组中的索引，从零开始。 */
export interface SvTableCellScope<T extends object = Record<string, unknown>> {
  row: T
  $index: number
}

/** 列声明；prop 支持对象路径，展示列通过 columnKey 区分，width 以像素为单位。 */
export interface SvTableColumnProps {
  prop?: string
  columnKey?: string
  label?: string
  type?: 'default' | 'selection' | 'index'
  width?: number
  sortable?: boolean
  filterType?: 'includesString' | 'equalsString' | 'inDateRange'
}

/** 声明列的内部注册数据；行类型仅在列插槽边界恢复，不向外暴露表格引擎。 */
export interface SvTableColumnDefinition {
  id: string
  props: Readonly<SvTableColumnProps>
  getElement: () => HTMLElement | null
  cell?: (scope: SvTableCellScope<object>) => VNode[]
  header?: () => VNode[]
}

/** 表格对外提供的选择操作；rowKey 必须在整份数据内唯一且稳定。 */
export interface SvTableInstance<T extends object> {
  clearSelection: () => void
  getSelectionRows: () => T[]
  toggleRowSelection: (row: T, selected?: boolean) => void
}
