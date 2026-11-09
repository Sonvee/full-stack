<template>
  <section
    class="flex min-h-0 flex-1 flex-col gap-3"
    :style="
      props.height
        ? {
            height: typeof props.height === 'number' ? `${props.height}px` : props.height,
            flex: 'none',
          }
        : undefined
    "
  >
    <div hidden><slot /></div>
    <div
      class="min-h-0 flex-1 overflow-hidden rounded-lg border [&>[data-slot=table-container]]:h-full"
    >
      <Table :class="props.tableClass" tabindex="0">
        <TableCaption class="sr-only">{{ props.caption }}</TableCaption>
        <TableHeader class="sticky top-0 z-10 bg-background">
          <TableRow v-for="group in table.getHeaderGroups()" :key="group.id">
            <TableHead
              v-for="header in group.headers"
              :key="header.id"
              scope="col"
              :style="columnStyle(header.column.id)"
              :aria-sort="
                header.column.getCanSort() ? sortDirection(header.column.getIsSorted()) : undefined
              "
            >
              <Checkbox
                v-if="columnById.get(header.column.id)?.props.type === 'selection'"
                :model-value="
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
                "
                :disabled="!table.getRowModel().rows.length"
                aria-label="选择当前页全部数据"
                @update:model-value="table.toggleAllPageRowsSelected($event === true)"
              />
              <Button
                v-else-if="header.column.getCanSort()"
                variant="ghost"
                size="sm"
                @click="header.column.toggleSorting()"
              >
                <FlexRender :header="header" />
                <i
                  :class="
                    cn(
                      header.column.getIsSorted() === 'asc'
                        ? 'sv-icon-sortascending'
                        : header.column.getIsSorted() === 'desc'
                          ? 'sv-icon-sortdescending'
                          : 'sv-icon-sort',
                    )
                  "
                  aria-hidden="true"
                  data-icon="inline-end"
                />
              </Button>
              <FlexRender v-else :header="header" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getAllCells()" :key="cell.id">
              <Checkbox
                v-if="columnById.get(cell.column.id)?.props.type === 'selection'"
                :model-value="row.getIsSelected()"
                :aria-label="`选择第 ${row.index + 1} 条数据`"
                @update:model-value="row.toggleSelected($event === true)"
              />
              <FlexRender v-else :cell="cell" />
            </TableCell>
          </TableRow>
          <TableRow v-if="!table.getRowModel().rows.length">
            <TableCell :colspan="Math.max(1, columns.length)">
              <slot name="empty">
                <Empty class="py-12"
                  ><EmptyHeader
                    ><EmptyTitle>暂无数据</EmptyTitle
                    ><EmptyDescription>请调整筛选条件后重试。</EmptyDescription></EmptyHeader
                  ></Empty
                >
              </slot>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, Fragment, h, onUpdated, provide, shallowRef, watch, type HTMLAttributes } from 'vue'
import {
  createColumnHelper,
  FlexRender,
  useTable,
  type ColumnFiltersState,
} from '@tanstack/vue-table'
import { get } from 'es-toolkit/compat'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { svTableKey } from './context'
import { svTableFeatures } from './table-features'
import type { SvTableColumnDefinition, SvTableInstance } from './types'

/**
 * 使用 SvTableColumn 声明列，TanStack Table 负责前端排序、筛选、选择和分页。
 *
 * @remarks
 * rowKey 必须唯一且稳定。默认填满父级剩余高度，父级须有确定高度并允许子级收缩。
 * pagination 仅控制数据分页，默认关闭；分页栏由调用方按需引入。
 * pageNum 从 1 开始，pageSize 默认 10，两者均支持 v-model。
 * filters 采用 TanStack ColumnFiltersState，修改筛选或每页条数会回到首页。
 */
interface SvTableProps {
  data: any[]
  rowKey: string | ((row: any) => string)
  filters?: ColumnFiltersState
  pagination?: boolean
  height?: number | string
  tableClass?: HTMLAttributes['class']
  caption?: string
}
const props = withDefaults(defineProps<SvTableProps>(), {
  filters: () => [],
  pagination: false,
  caption: '数据表格，可滚动查看',
})
const emit = defineEmits<{
  selectionChange: [rows: any[]]
  /** 分页前的筛选、排序结果，初始化及结果变化时通知外部工具栏等消费者。 */
  filteredChange: [rows: any[]]
}>()
/** 当前页码，须为正整数；通过 v-model:page-num 同步，默认第 1 页。 */
const pageNum = defineModel<number>('pageNum', { default: 1 })
/** 每页条数，须为正整数；通过 v-model:page-size 同步，默认 10 条。 */
const pageSize = defineModel<number>('pageSize', { default: 10 })
/** 仅在适配 TanStack 时将从 1 开始的 pageNum 转换为从 0 开始的 pageIndex。 */
const paginationState = computed(() => ({ pageIndex: pageNum.value - 1, pageSize: pageSize.value }))
const definitions = shallowRef<SvTableColumnDefinition[]>([])
provide(svTableKey, {
  register: (column) => {
    definitions.value = [...definitions.value, column]
  },
  unregister: (id) => {
    definitions.value = definitions.value.filter((column) => column.id !== id)
  },
})
// 按声明位置恢复动态列顺序，保证 v-if 重建和 keyed v-for 调整后仍与模板一致。
onUpdated(() => {
  const ordered = [...definitions.value].sort((a, b) => {
    const first = a.getElement()
    const second = b.getElement()
    if (!first || !second || first === second) {
      return 0
    }
    return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  })
  if (ordered.some((column, index) => column !== definitions.value[index])) {
    definitions.value = ordered
  }
})
/** 字段列使用 prop 作为筛选键；展示列可显式指定 columnKey，所有键须唯一。 */
function columnId(column: SvTableColumnDefinition) {
  return column.props.columnKey || column.props.prop || column.id
}
const columnById = computed(
  () => new Map(definitions.value.map((column) => [columnId(column), column])),
)
const helper = createColumnHelper<typeof svTableFeatures, any>()
/** 插槽返回的节点数组需包装为 Fragment，避免 FlexRender 将数组识别为组件定义。 */
const columns = computed(() =>
  helper.columns(
    definitions.value.map((column) => {
      const config = {
        id: columnId(column),
        header: () => {
          if (column.header) {
            return h(Fragment, null, column.header())
          }
          return column.props.label ?? ''
        },
        enableSorting: !!column.props.prop && column.props.sortable,
        filterFn: column.props.filterType || ('includesString' as const),
        cell: (context: { row: { original: any; index: number }; getValue: () => unknown }) => {
          const index = context.row.index
          if (column.cell) {
            return h(Fragment, null, column.cell({ row: context.row.original, $index: index }))
          }
          if (column.props.type === 'index') {
            return index + 1
          }
          return String(context.getValue() ?? '')
        },
      }
      return column.props.prop
        ? helper.accessor((row) => get(row, column.props.prop!), config)
        : helper.display(config)
    }),
  ),
)

/** 从声明的字段或回调读取稳定行键；不依赖分页位置。 */
function getRowId(row: any) {
  return typeof props.rowKey === 'function' ? props.rowKey(row) : String(get(row, props.rowKey))
}
const table = useTable({
  features: svTableFeatures,
  get data() {
    return props.data
  },
  get columns() {
    return columns.value
  },
  getRowId,
  get manualPagination() {
    return !props.pagination
  },
  defaultColumn: { enableSorting: false },
  autoResetPageIndex: false,
  state: {
    get pagination() {
      return paginationState.value
    },
    get columnFilters() {
      return props.filters
    },
  },
  onPaginationChange: (updater) => {
    const next = typeof updater === 'function' ? updater(paginationState.value) : updater
    const sizeChanged = next.pageSize !== pageSize.value
    pageSize.value = next.pageSize
    pageNum.value = sizeChanged ? 1 : next.pageIndex + 1
  },
})
const filteredRows = computed(() => table.getPrePaginatedRowModel().rows.map((row) => row.original))
const selectedRows = computed(() =>
  table.getFilteredSelectedRowModel().rows.map((row) => row.original),
)
watch(
  pageSize,
  () => {
    pageNum.value = 1
  },
  { flush: 'sync' },
)
watch(selectedRows, (rows) => emit('selectionChange', rows))
watch(filteredRows, (rows) => emit('filteredChange', rows), { immediate: true })
watch(
  () => props.filters,
  () => {
    table.firstPage()
    table.resetRowSelection()
  },
  { deep: true },
)
watch(
  () => props.data,
  () => {
    table.resetRowSelection()
    table.setPageIndex((index) => Math.max(0, Math.min(index, table.getPageCount() - 1)))
  },
)

/** 将引擎排序值映射为 ARIA 表头状态。 */
function sortDirection(value: false | 'asc' | 'desc') {
  return value === 'asc' ? 'ascending' : value === 'desc' ? 'descending' : 'none'
}
/** 宽度仅作用于列；选择列默认保留适合复选框的空间。 */
function columnStyle(id: string) {
  const column = columnById.value.get(id)
  const width = column?.props.width ?? (column?.props.type === 'selection' ? 48 : undefined)
  return width ? { width: `${width}px`, minWidth: `${width}px` } : undefined
}

/** 清除所有页面的选择。 */
function clearSelection() {
  table.resetRowSelection()
}
/** 获取当前有效筛选范围内所有已选数据。 */
function getSelectionRows() {
  return [...selectedRows.value]
}
/** 按稳定行键切换选择；selected 未传时反转。 */
function toggleRowSelection(row: any, selected?: boolean) {
  table.getRow(getRowId(row))?.toggleSelected(selected)
}
defineExpose<SvTableInstance>({ clearSelection, getSelectionRows, toggleRowSelection })
</script>

<style lang="scss" scoped></style>
