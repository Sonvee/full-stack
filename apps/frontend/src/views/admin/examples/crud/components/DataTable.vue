<template>
  <section class="flex min-h-48 flex-1 flex-col gap-3" aria-label="数据列表">
    <div
      class="flex shrink-0 flex-wrap items-center justify-between gap-3"
      role="group"
      aria-label="表格工具栏"
    >
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <Button size="sm" @click="emit('create')">
          <i class="sv-icon-plus" aria-hidden="true" data-icon="inline-start" />新增数据
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!selectedRecords.length"
          @click="emit('delete', selectedRecords)"
        >
          <i class="sv-icon-delete" aria-hidden="true" data-icon="inline-start" />批量删除
          <span v-if="selectedRecords.length">({{ selectedRecords.length }})</span>
        </Button>
        <slot name="tools" :filtered-records="filteredRecords" />
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="刷新数据"
          title="刷新数据"
          @click="emit('refresh')"
        >
          <i class="sv-icon-refresh" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          :aria-label="showFilters ? '隐藏筛选栏' : '显示筛选栏'"
          :title="showFilters ? '隐藏筛选栏' : '显示筛选栏'"
          :aria-expanded="showFilters"
          aria-controls="record-filters"
          @click="emit('toggleFilters')"
        >
          <i :class="cn(showFilters ? 'sv-icon-eyeoff' : 'sv-icon-filter')" aria-hidden="true" />
        </Button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-hidden rounded-lg border">
      <Table
        container-class="h-full"
        class="min-w-[1180px]"
        tabindex="0"
        role="region"
        aria-label="数据表格，可滚动查看"
      >
        <TableCaption class="sr-only"
          >通用数据列表，包含数据编号、数据项甲至庚及创建日期</TableCaption
        >
        <TableHeader class="sticky top-0 z-10 bg-background">
          <TableRow v-for="group in table.getHeaderGroups()" :key="group.id">
            <TableHead
              v-for="header in group.headers"
              :key="header.id"
              scope="col"
              :aria-sort="
                header.column.getCanSort() ? sortDirection(header.column.getIsSorted()) : undefined
              "
              :class="cn(header.id === 'select' && 'w-12 px-4', header.id === 'actions' && 'w-32')"
            >
              <Checkbox
                v-if="header.id === 'select'"
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
            <TableCell
              v-for="cell in row.getAllCells()"
              :key="cell.id"
              :class="cn(cell.column.id === 'select' && 'px-4')"
            >
              <Checkbox
                v-if="cell.column.id === 'select'"
                :model-value="row.getIsSelected()"
                :aria-label="`选择数据 ${row.original.id}`"
                @update:model-value="row.toggleSelected($event === true)"
              />
              <Badge
                v-else-if="cell.column.id === 'f'"
                :variant="row.original.f === '选项甲' ? 'default' : 'secondary'"
              >
                {{ row.original.f }}
              </Badge>
              <div v-else-if="cell.column.id === 'actions'" class="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  :aria-label="`编辑数据 ${row.original.id}`"
                  @click="emit('edit', row.original)"
                  >编辑</Button
                >
                <Button
                  variant="ghost"
                  size="sm"
                  :aria-label="`删除数据 ${row.original.id}`"
                  @click="emit('delete', [row.original])"
                  >删除</Button
                >
              </div>
              <FlexRender v-else :cell="cell" />
            </TableCell>
          </TableRow>
          <TableRow v-if="!table.getRowModel().rows.length">
            <TableCell :colspan="recordColumns.length">
              <Empty class="py-12">
                <EmptyHeader>
                  <EmptyTitle>暂无数据</EmptyTitle>
                  <EmptyDescription>可以调整筛选条件，或新增一条数据。</EmptyDescription>
                </EmptyHeader>
                <EmptyContent
                  ><Button variant="outline" size="sm" @click="emit('create')"
                    >新增数据</Button
                  ></EmptyContent
                >
              </Empty>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <footer class="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground" role="status">
        共 {{ filteredRecords.length }} 条，已选择 {{ selectedRecords.length }} 条
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <label for="record-page-size" class="text-sm text-muted-foreground">每页</label>
          <Select
            :model-value="String(table.atoms.pagination.get().pageSize)"
            @update:model-value="changePageSize"
          >
            <SelectTrigger id="record-page-size" size="sm" class="w-20"
              ><SelectValue
            /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="size in [10, 20, 50]" :key="size" :value="String(size)"
                  >{{ size }} 条</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Pagination
          v-model:page="page"
          :total="filteredRecords.length"
          :items-per-page="table.atoms.pagination.get().pageSize"
          :sibling-count="0"
          show-edges
          class="w-auto"
          aria-label="数据列表分页"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious size="icon-sm" aria-label="上一页"
              ><i class="sv-icon-chevronleft" aria-hidden="true"
            /></PaginationPrevious>
            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
                size="icon-sm"
                :aria-label="`第 ${item.value} 页`"
                >{{ item.value }}</PaginationItem
              >
              <PaginationEllipsis v-else :index="index"
                ><span aria-hidden="true">…</span
                ><span class="sr-only">更多页码</span></PaginationEllipsis
              >
            </template>
            <PaginationNext size="icon-sm" aria-label="下一页"
              ><i class="sv-icon-chevronright" aria-hidden="true"
            /></PaginationNext>
          </PaginationContent>
        </Pagination>
      </div>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { FlexRender, useTable, type ColumnFiltersState } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { type DataRecord, type FilterValues } from '../data-model'
import { recordColumns, recordTableFeatures } from '../table-definition'

const { records, filters, showFilters } = defineProps<{
  records: DataRecord[]
  filters: FilterValues
  showFilters: boolean
}>()
const emit = defineEmits<{
  create: []
  edit: [record: DataRecord]
  delete: [records: DataRecord[]]
  refresh: []
  toggleFilters: []
}>()

const columnFilters = computed<ColumnFiltersState>(() => {
  const result: ColumnFiltersState = Object.entries(filters)
    .filter(([key, value]) => key !== 'createdFrom' && key !== 'createdTo' && value)
    .map(([id, value]) => ({ id, value }))
  if (filters.createdFrom || filters.createdTo) {
    result.push({ id: 'createdAt', value: [filters.createdFrom, filters.createdTo] })
  }
  return result
})

const table = useTable({
  features: recordTableFeatures,
  get data() {
    return records
  },
  columns: recordColumns,
  getRowId: (record: DataRecord) => record.id,
  defaultColumn: { enableSorting: false },
  autoResetPageIndex: false,
  state: {
    get columnFilters() {
      return columnFilters.value
    },
  },
  initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
})

const filteredRecords = computed(() =>
  table.getPrePaginatedRowModel().rows.map((row) => row.original),
)
const selectedRecords = computed(() =>
  table.getFilteredSelectedRowModel().rows.map((row) => row.original),
)
const page = computed({
  get: () => table.atoms.pagination.get().pageIndex + 1,
  set: (value: number) => table.setPageIndex(value - 1),
})

watch(
  () => filters,
  () => {
    table.firstPage()
    table.resetRowSelection()
  },
)
watch(
  () => records,
  () => {
    table.resetRowSelection()
    table.setPageIndex((index) => Math.max(0, Math.min(index, table.getPageCount() - 1)))
  },
)

function changePageSize(value: unknown) {
  table.setPageSize(Number(value))
  table.firstPage()
}

function sortDirection(value: false | 'asc' | 'desc') {
  return value === 'asc' ? 'ascending' : value === 'desc' ? 'descending' : 'none'
}
</script>

<style lang="scss" scoped></style>
