<template>
  <section class="flex min-h-0 flex-1 flex-col gap-4">
    <header class="flex shrink-0 items-center justify-between gap-2">
      <h1 class="text-xl font-semibold">CRUD 模板</h1>
    </header>

    <!-- 条件筛选栏 -->
    <FilterForm v-show="showFilters" @search="toSearch" @reset="toReset" />

    <!-- 表格工具栏 -->
    <div class="flex shrink-0 flex-wrap items-center gap-2 [&>.el-button]:ml-0!">
      <ElButton type="primary" @click="toAdd"><i class="sv-icon-plus mr-2" />新增</ElButton>
      <ElButton :disabled="selectedList.length === 0" @click="toDelete()">
        <i class="sv-icon-delete mr-2" />删除
      </ElButton>
      <ElButton @click="importList"><i class="sv-icon-import mr-2" />导入</ElButton>
      <ElButton @click="exportList"><i class="sv-icon-export mr-2" />导出</ElButton>
      <span class="min-w-0 flex-1" />
      <ElButton circle title="刷新" @click="toRefresh">
        <i class="sv-icon-refresh" />
      </ElButton>
      <ElButton
        circle
        :title="showFilters ? '隐藏筛选' : '显示筛选'"
        @click="toToggleFilter"
      >
        <i :class="showFilters ? 'sv-icon-eyeoff' : 'sv-icon-filter'" />
      </ElButton>
    </div>

    <!-- 数据表格 -->
    <div class="min-h-0 flex-1 overflow-hidden rounded-lg border">
      <ElTable
        ref="dataTableRef"
        :data="pageData"
        row-key="id"
        height="100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortProp = $event.prop; sortOrder = $event.order"
      >
        <ElTableColumn type="selection" :width="48" reserve-selection />
        <ElTableColumn prop="id" label="数据编号" :min-width="120" />
        <ElTableColumn prop="aInput" label="数据项甲" :min-width="120" sortable="custom" />
        <ElTableColumn prop="bInput" label="数据项乙" :min-width="120" />
        <ElTableColumn prop="cInput" label="数据项丙" :min-width="120" />
        <ElTableColumn prop="dSelect" label="数据项丁" :min-width="100">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_d_select" :data="row.dSelect" label-key="label" value-key="value" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="eSelect" label="数据项戊" :min-width="100">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_e_select" :data="row.eSelect" label-key="label" value-key="value" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="fSelect" label="数据项己" :min-width="100">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_f_select" :data="row.fSelect" label-key="label" value-key="value" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="gSelect" label="数据项庚" :min-width="100">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_g_select" :data="row.gSelect" label-key="label" value-key="value" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createdAt" label="创建日期" :min-width="200" sortable="custom" />
        <!-- @vue-generic {DemoListItem} -->
        <ElTableColumn column-key="actions" label="操作" :width="132">
          <template #default="{ row }">
            <div class="flex items-center gap-1 [&>.el-button]:ml-0!">
              <ElButton type="primary" link size="small" @click="toUpdate(row)">修改</ElButton>
              <ElButton type="danger" link size="small" @click="toDelete(row)">删除</ElButton>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <!-- 表格分页栏 -->
    <footer class="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-muted-foreground">已选择 {{ selectedList.length }} 条</p>
      <div class="max-w-full overflow-x-auto">
        <ElPagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="queryParams.pageNum = 1"
        />
      </div>
    </footer>

    <!-- 新增 / 编辑弹窗 -->
    <ActionDialog ref="actionDialogRef" v-model:open="actionDialogOpen" :title="actionTitle" :mode="actionMode" @confirm="toConfirm" />
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide, ref, shallowRef, useTemplateRef } from 'vue'
import { ElButton, ElMessage, ElMessageBox, ElPagination, ElTable, ElTableColumn, type Sort } from 'element-plus'
import { orderBy } from 'es-toolkit/compat'
import { apiDemoAdd, apiDemoDelete, apiDemoExport, apiDemoImport, apiDemoList, apiDemoUpdate } from '@/api/demo'
import type { DemoListItem, DemoQueryParams } from '@/types/demo'
import SvDictTag from '@/components/SvDictTag/SvDictTag.vue'
import ActionDialog from './components/ActionDialog.vue'
import FilterForm from './components/FilterForm.vue'
import { dict_d_select, dict_e_select, dict_f_select, dict_g_select } from './dict-data'

/** 页面统一向子组件提供字典。 */
provide('__DICT__', {
  dict_d_select,
  dict_e_select,
  dict_f_select,
  dict_g_select
})

const dataList = shallowRef<DemoListItem[]>([])
const total = shallowRef(0)
const selectedList = shallowRef<DemoListItem[]>([])
const queryParams = ref<DemoQueryParams>({
  aInput: '',
  bInput: '',
  cInput: '',
  dSelect: '',
  eSelect: '',
  fSelect: '',
  gSelect: '',
  createdRange: null,
  pageNum: 1,
  pageSize: 10
})
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const actionTitle = shallowRef('新增数据')
const actionMode = shallowRef<'add' | 'update'>('add')
const actionDialogRef = useTemplateRef('actionDialogRef')
const dataTableRef = useTemplateRef('dataTableRef')
const sortProp = shallowRef<string | null>(null)
const sortOrder = shallowRef<Sort['order'] | null>(null)

/** 延续示例的前端分页，先排序全部结果，再取当前页。 */
const pageData = computed(() => {
  const rows = sortProp.value && sortOrder.value
    ? orderBy(dataList.value, [sortProp.value], [sortOrder.value === 'ascending' ? 'asc' : 'desc'])
    : dataList.value
  const start = (queryParams.value.pageNum - 1) * queryParams.value.pageSize
  return rows.slice(start, start + queryParams.value.pageSize)
})

onMounted(async () => {
  toQuery()
})

/** 提交筛选条件并从第一页重新查询。 */
function toSearch(values: Omit<DemoQueryParams, 'pageNum' | 'pageSize'>) {
  Object.assign(queryParams.value, values, { pageNum: 1 })
  toQuery()
}

/** 清除筛选条件并从第一页重新查询。 */
function toReset() {
  queryParams.value = { pageNum: 1, pageSize: queryParams.value.pageSize }
  toQuery()
}

/** 查询列表并更新表格数据和总数。 */
async function toQuery() {
  const res = await apiDemoList(queryParams.value)
  dataList.value = res.data || []
  total.value = res.total || 0
  dataTableRef.value?.clearSelection()
  queryParams.value.pageNum = Math.max(1, Math.min(queryParams.value.pageNum, Math.ceil(dataList.value.length / queryParams.value.pageSize)))
}

/** 使用当前筛选和分页条件刷新列表。 */
function toRefresh() {
  toQuery()
}

/** 切换筛选栏显示状态。 */
function toToggleFilter() {
  showFilters.value = !showFilters.value
}

/** 记录当前选择的表格行。 */
function handleSelectionChange(rows: DemoListItem[]) {
  selectedList.value = rows
}

/** 初始化并打开新增弹窗。 */
function toAdd() {
  actionTitle.value = '新增数据'
  actionMode.value = 'add'
  actionDialogRef.value?.initForm()
  actionDialogOpen.value = true
}

/** 根据操作栏传入的行数据初始化并打开修改弹窗。 */
function toUpdate(row: DemoListItem) {
  actionTitle.value = '修改数据'
  actionMode.value = 'update'
  actionDialogRef.value?.initForm(row)
  actionDialogOpen.value = true
}

/** 等待新增或修改请求完成后关闭弹窗。 */
async function toConfirm(values: DemoListItem) {
  if (actionMode.value === 'update') {
    await apiDemoUpdate(values)
    ElMessage.success('修改请求已提交')
  } else {
    await apiDemoAdd(values)
    ElMessage.success('新增请求已提交')
  }
  actionDialogOpen.value = false
}

/** 打开删除确认弹窗，支持单行和已选数据。 */
async function toDelete(row?: DemoListItem) {
  const count = row ? 1 : selectedList.value.length
  try {
    await ElMessageBox.confirm('此模板只打印删除请求，不会修改示例列表。', `确认删除 ${count} 条数据？`, {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await apiDemoDelete()
  ElMessage.success(`删除请求已提交，共 ${count} 条数据`)
}

/** 导入操作占位，接入业务后在此调用导入 API。 */
async function importList() {
  await apiDemoImport()
}

/** 导出操作占位，接入业务后在此调用导出 API。 */
async function exportList() {
  await apiDemoExport()
}
</script>

<style lang="scss" scoped></style>
