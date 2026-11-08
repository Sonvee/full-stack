<template>
  <section class="flex min-h-0 flex-1 flex-col gap-4" aria-labelledby="crud-title">
    <header class="flex shrink-0 flex-wrap items-center justify-between gap-2">
      <div class="flex flex-col gap-1">
        <h1 id="crud-title" class="text-xl font-semibold tracking-tight">CRUD 模板</h1>
        <p class="text-sm text-muted-foreground">
          通用数据增删改查模板 · 数据仅在当前页面保留，重新进入后恢复。
        </p>
      </div>
      <Badge variant="outline">本地示例</Badge>
    </header>

    <FilterForm v-show="showFilters" @search="filters = $event" />
    <TableToolbar
      :selection="selectedRecords"
      :show-filters="showFilters"
      @create="openActionDialog(null)"
      @delete="pendingDelete = $event"
      @refresh="refresh"
      @toggle-filters="showFilters = !showFilters"
    >
      <DataTransfer :records="filteredRecords" @import="importRecords" @notice="showNotice" />
    </TableToolbar>
    <DataTable
      :records="records"
      :filters="filters"
      @create="openActionDialog(null)"
      @edit="openActionDialog"
      @delete="pendingDelete = $event"
      @selection-change="selectedRecords = $event"
      @filtered-change="filteredRecords = $event"
    />

    <ActionDialog
      v-if="actionDialogOpen"
      :record="editingRecord"
      @save="saveRecord"
      @close="actionDialogOpen = false"
    />
    <AlertDialog :open="pendingDelete.length > 0" @update:open="handleDeleteOpenChange">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            >确认删除{{
              pendingDelete.length > 1 ? ` ${pendingDelete.length} 条数据` : '这条数据'
            }}？</AlertDialogTitle
          >
          <AlertDialogDescription
            >删除后，所选数据会从当前示例列表中移除。此操作无法撤销。</AlertDialogDescription
          >
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="deleteRecords">确认删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { toast } from 'vue-sonner'
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
import ActionDialog from './components/ActionDialog.vue'
import FilterForm from './components/FilterForm.vue'
import DataTable from './components/DataTable.vue'
import DataTransfer from './components/DataTransfer.vue'
import TableToolbar from './components/TableToolbar.vue'
import { createDemoRecords } from './demo-data'
import {
  defaultFilterValues,
  type DataRecord,
  type FormValues,
  type FilterValues,
} from './data-model'

const records = shallowRef<DataRecord[]>(createDemoRecords())
/** 工具栏消费表格发布的选择和筛选结果，导出包含符合条件的所有页面数据。 */
const selectedRecords = shallowRef<DataRecord[]>([])
const filteredRecords = shallowRef<DataRecord[]>([])
let nextRecordNumber = records.value.length + 1
const filters = shallowRef<FilterValues>({ ...defaultFilterValues })
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const editingRecord = shallowRef<DataRecord | null>(null)
const pendingDelete = shallowRef<DataRecord[]>([])
/** 将页面操作及导入导出反馈交给全局 Sonner 通知，避免挤占表格可用高度。 */
function showNotice(text: string, error = false) {
  if (error) toast.error(text)
  else toast.success(text)
}

function openActionDialog(record: DataRecord | null) {
  editingRecord.value = record
  actionDialogOpen.value = true
}

function saveRecord(draft: FormValues) {
  if (editingRecord.value) {
    const updated = { ...editingRecord.value, ...draft }
    records.value = records.value.map((record) => (record.id === updated.id ? updated : record))
    showNotice('数据已更新')
  } else {
    records.value = [createRecord(draft), ...records.value]
    showNotice('数据已新增；若未显示，请检查当前筛选条件或页码')
  }
  actionDialogOpen.value = false
}

function deleteRecords() {
  const ids = new Set(pendingDelete.value.map((record) => record.id))
  records.value = records.value.filter((record) => !ids.has(record.id))
  showNotice(`已删除 ${ids.size} 条数据`)
  pendingDelete.value = []
}

function handleDeleteOpenChange(open: boolean) {
  if (!open) pendingDelete.value = []
}

function refresh() {
  records.value = [...records.value]
  showNotice('已刷新当前示例数据，保留本次新增与编辑结果')
}

function importRecords(drafts: FormValues[]) {
  records.value = [...drafts.map(createRecord), ...records.value]
  showNotice(`已导入 ${drafts.length} 条数据；若未显示，请检查当前筛选条件或页码`)
}

/**
 * 为已校验的表单值生成页面内唯一的递增编号及本地创建日期。
 * 调用会消耗一个编号；删除数据后也不复用已有编号。
 */
function createRecord(draft: FormValues): DataRecord {
  const now = new Date()
  // 使用本地日期，避免 UTC 日期在午夜前后偏移。
  const createdAt = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
  return { ...draft, id: `R${String(nextRecordNumber++).padStart(4, '0')}`, createdAt }
}
</script>

<style lang="scss" scoped></style>
