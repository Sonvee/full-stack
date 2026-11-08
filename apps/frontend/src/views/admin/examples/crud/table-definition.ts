import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_inDateRange,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_text,
  tableFeatures,
} from '@tanstack/vue-table'
import { fields, type DataRecord } from './data-model'

/** 按官方 v9 方案只注册当前表格需要的能力。 */
export const recordTableFeatures = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
    inDateRange: filterFn_inDateRange,
  },
  sortFns: { text: sortFn_text },
})

const helper = createColumnHelper<typeof recordTableFeatures, DataRecord>()

export const recordColumns = helper.columns([
  helper.display({ id: 'select', enableSorting: false }),
  helper.accessor('id', { header: '数据编号', filterFn: 'includesString' }),
  ...fields.map((field) =>
    helper.accessor(field.name, {
      header: field.label,
      filterFn: field.options ? 'equalsString' : 'includesString',
      enableSorting: field.name === 'a',
      sortFn: 'text',
    }),
  ),
  helper.accessor('createdAt', {
    header: '创建日期',
    filterFn: 'inDateRange',
    enableSorting: true,
    sortFn: 'text',
  }),
  helper.display({ id: 'actions', header: '操作', enableSorting: false }),
])
