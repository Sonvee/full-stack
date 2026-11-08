<template>
  <section class="flex min-h-0 flex-1 flex-col gap-4" aria-labelledby="crud-title">
    <header class="flex shrink-0 flex-wrap items-center justify-between gap-2">
      <div class="flex flex-col gap-1">
        <h1 id="crud-title" class="text-xl font-semibold tracking-tight">CRUD 模板</h1>
        <p class="text-sm text-muted-foreground">
          通用数据增删改查模板 · 增删改操作仅打印请求，不修改静态列表。
        </p>
      </div>
      <Badge variant="outline">本地示例</Badge>
    </header>

    <!-- 条件筛选栏 -->
    <FilterForm v-show="showFilters" @search="handleFilterSearch" />

    <!-- 表格工具栏 -->
    <div
      class="flex shrink-0 flex-wrap items-center justify-between gap-3"
      role="group"
      aria-label="表格工具栏"
    >
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <Button size="sm" @click="toAdd">
          <i class="sv-icon-plus" aria-hidden="true" data-icon="inline-start" />新增数据
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!selectedList.length"
          @click="toDelete(selectedList)"
        >
          <i class="sv-icon-delete" aria-hidden="true" data-icon="inline-start" />批量删除
          <span v-if="selectedList.length">({{ selectedList.length }})</span>
        </Button>
        <Button variant="outline" size="sm" @click="importList">
          <i class="sv-icon-import" aria-hidden="true" data-icon="inline-start" />导入
        </Button>
        <Button variant="outline" size="sm" @click="exportList">
          <i class="sv-icon-export" aria-hidden="true" data-icon="inline-start" />导出
        </Button>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" aria-label="刷新数据" title="刷新数据" @click="refresh">
          <i class="sv-icon-refresh" aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          :aria-label="showFilters ? '隐藏筛选栏' : '显示筛选栏'"
          :title="showFilters ? '隐藏筛选栏' : '显示筛选栏'"
          :aria-expanded="showFilters"
          aria-controls="record-filters"
          @click="toggleFilters"
        >
          <i :class="cn(showFilters ? 'sv-icon-eyeoff' : 'sv-icon-filter')" aria-hidden="true" />
        </Button>
      </div>
    </div>
    <!-- 数据表格 -->
    <SvTable
      v-model:page-num="pageNum"
      v-model:page-size="pageSize"
      :data="dataList"
      row-key="id"
      :filters="columnFilters"
      pagination
      table-class="min-w-[1180px]"
      class="min-h-48"
      caption="通用数据列表，包含数据编号、数据项甲至庚及创建日期"
      @selection-change="handleSelectionChange"
      @filtered-change="handleFilteredChange"
    >
      <SvTableColumn type="selection" />
      <SvTableColumn prop="id" label="数据编号" />
      <SvTableColumn prop="a-input" label="数据项甲" filter-type="includesString" sortable />
      <SvTableColumn prop="b-input" label="数据项乙" filter-type="includesString" />
      <SvTableColumn prop="c-input" label="数据项丙" filter-type="includesString" />
      <SvTableColumn prop="d-select" label="数据项丁" filter-type="equalsString" />
      <SvTableColumn prop="e-select" label="数据项戊" filter-type="equalsString" />
      <!-- @vue-generic {DemoListItem} -->
      <SvTableColumn prop="f-select" label="数据项己" filter-type="equalsString">
        <template #default="{ row }">
          <Badge :variant="row['f-select'] === '选项甲' ? 'default' : 'secondary'">
            {{ row['f-select'] }}
          </Badge>
        </template>
      </SvTableColumn>
      <SvTableColumn prop="g-select" label="数据项庚" filter-type="equalsString" />
      <SvTableColumn prop="createdAt" label="创建日期" filter-type="inDateRange" sortable />
      <!-- @vue-generic {DemoListItem} -->
      <SvTableColumn column-key="actions" label="操作" :width="132">
        <template #default="{ row }">
          <div class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              :aria-label="`编辑数据 ${row.id}`"
              @click="toUpdate(row)"
            >编辑</Button>
            <Button
              variant="ghost"
              size="sm"
              :aria-label="`删除数据 ${row.id}`"
              @click="toDelete([row])"
            >删除</Button>
          </div>
        </template>
      </SvTableColumn>
    </SvTable>
    <!-- 表格分页栏 -->
    <SvTablePagination
      v-model:page-num="pageNum"
      v-model:page-size="pageSize"
      :total="filteredList.length"
      :selected="selectedList.length"
    />

    <!-- 新增 / 编辑弹窗 -->
    <ActionDialog
      v-model:open="actionDialogOpen"
      :item="editingItem"
      @save="saveItem"
    />
    <!-- 删除确认弹窗 -->
    <AlertDialog :open="pendingDelete.length > 0" @update:open="handleDeleteOpenChange">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            >确认删除{{
              pendingDelete.length > 1 ? ` ${pendingDelete.length} 条数据` : '这条数据'
            }}？</AlertDialogTitle
          >
          <AlertDialogDescription
            >此模板仅打印删除请求，不会修改静态示例列表。</AlertDialogDescription
          >
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="deleteList">确认删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, shallowRef } from 'vue'
import type { ColumnFiltersState } from '@tanstack/vue-table'
import { toast } from 'vue-sonner'
import {
  apiDemoAdd,
  apiDemoDelete,
  apiDemoExport,
  apiDemoImport,
  apiDemoList,
  apiDemoUpdate,
  defaultDemoFilterValues,
  type DemoFilterValues,
  type DemoFormValues,
  type DemoListItem,
} from '@/api/demo'
import SvTable from '@/components/SvTable/SvTable.vue'
import SvTableColumn from '@/components/SvTable/SvTableColumn.vue'
import SvTablePagination from '@/components/SvTable/SvTablePagination.vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ActionDialog from './components/ActionDialog.vue'
import FilterForm from './components/FilterForm.vue'

const dataList = shallowRef<DemoListItem[]>([])
/** 表格发布的选择结果，供批量删除和分页栏使用。 */
const selectedList = shallowRef<DemoListItem[]>([])
const filteredList = shallowRef<DemoListItem[]>([])
const filters = shallowRef<DemoFilterValues>({ ...defaultDemoFilterValues })
const pageNum = shallowRef(1)
const pageSize = shallowRef(10)
/** 将已提交的筛选条件映射为列条件；日期范围包含起止当天。 */
const columnFilters = computed<ColumnFiltersState>(() => {
  const result = Object.entries(filters.value)
    .filter(([key, value]) => key !== 'createdFrom' && key !== 'createdTo' && value)
    .map(([id, value]) => ({ id, value })) as ColumnFiltersState
  if (filters.value.createdFrom || filters.value.createdTo) {
    result.push({ id: 'createdAt', value: [filters.value.createdFrom, filters.value.createdTo] })
  }
  return result
})
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const editingItem = shallowRef<DemoListItem | null>(null)
const pendingDelete = shallowRef<DemoListItem[]>([])

onMounted(loadList)

function toAdd() {
  editingItem.value = null
  actionDialogOpen.value = true
}

function toUpdate(item: DemoListItem) {
  editingItem.value = item
  actionDialogOpen.value = true
}

function handleFilterSearch(values: DemoFilterValues) {
  filters.value = values
}

function toDelete(items: DemoListItem[]) {
  pendingDelete.value = [...items]
}

function toggleFilters() {
  showFilters.value = !showFilters.value
}

function handleSelectionChange(rows: DemoListItem[]) {
  selectedList.value = rows
}

function handleFilteredChange(rows: DemoListItem[]) {
  filteredList.value = rows
}

function saveItem(draft: DemoFormValues) {
  if (editingItem.value) {
    apiDemoUpdate(editingItem.value.id, draft)
    toast('修改请求已提交')
  } else {
    apiDemoAdd(draft)
    toast('新增请求已提交')
  }
  actionDialogOpen.value = false
}

function deleteList() {
  const ids = pendingDelete.value.map((item) => item.id)
  apiDemoDelete(ids)
  toast(`删除请求已提交，共 ${ids.length} 条数据`)
  pendingDelete.value = []
}

function handleDeleteOpenChange(open: boolean) {
  if (!open) {
    pendingDelete.value = []
  }
}

async function refresh() {
  await loadList()
  toast.success('已刷新示例数据')
}

async function loadList() {
  dataList.value = await apiDemoList()
}

/** 导入操作占位，复制模板后接入实际业务逻辑。 */
function importList() {
  apiDemoImport()
}

/** 导出操作占位，复制模板后接入实际业务逻辑。 */
function exportList() {
  apiDemoExport()
}

</script>

<style lang="scss" scoped></style>
