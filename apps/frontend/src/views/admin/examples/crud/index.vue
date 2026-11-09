<template>
  <section class="flex min-h-0 flex-1 flex-col gap-4" aria-labelledby="crud-title">
    <header class="flex shrink-0 items-center justify-between gap-2">
      <h1 id="crud-title" class="text-xl font-semibold">CRUD 模板</h1>
    </header>

    <!-- 条件筛选栏 -->
    <FilterForm v-show="showFilters" @search="toSearch" />

    <!-- 表格工具栏 -->
    <div class="flex shrink-0 flex-wrap items-center gap-2" role="toolbar" aria-label="表格工具栏">
      <Button size="sm" @click="toAdd"> <i class="sv-icon-plus" aria-hidden="true" data-icon="inline-start" />新增 </Button>
      <Button variant="outline" size="sm" :disabled="selectedList.length !== 1" @click="toUpdate()">
        <i class="sv-icon-edit" aria-hidden="true" data-icon="inline-start" />修改
      </Button>
      <Button variant="outline" size="sm" :disabled="selectedList.length === 0" @click="toDelete()">
        <i class="sv-icon-delete" aria-hidden="true" data-icon="inline-start" />删除
      </Button>
      <Button variant="outline" size="sm" @click="importList">
        <i class="sv-icon-import" aria-hidden="true" data-icon="inline-start" />导入
      </Button>
      <Button variant="outline" size="sm" @click="exportList">
        <i class="sv-icon-export" aria-hidden="true" data-icon="inline-start" />导出
      </Button>
      <span class="min-w-0 flex-1" />
      <Button variant="outline" size="icon-sm" aria-label="刷新" title="刷新" @click="toRefresh">
        <i class="sv-icon-refresh" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        :aria-label="showFilters ? '隐藏筛选' : '显示筛选'"
        :title="showFilters ? '隐藏筛选' : '显示筛选'"
        @click="toToggleFilter"
      >
        <i :class="showFilters ? 'sv-icon-eyeoff' : 'sv-icon-filter'" aria-hidden="true" />
      </Button>
    </div>

    <!-- 数据表格 -->
    <SvTable
      v-model:page-num="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :data="dataList"
      row-key="id"
      pagination
      table-class="min-w-[1180px]"
      caption="CRUD 模板数据列表"
      @selection-change="handleSelectionChange"
    >
      <SvTableColumn type="selection" />
      <SvTableColumn prop="id" label="数据编号" />
      <SvTableColumn prop="aInput" label="数据项甲" sortable />
      <SvTableColumn prop="bInput" label="数据项乙" />
      <SvTableColumn prop="cInput" label="数据项丙" />
      <!-- @vue-generic {DemoListItem} -->
      <SvTableColumn prop="dSelect" label="数据项丁">
        <template #default="{ row }">
          <SvDictTag :dict-list="dict_d_select" :data="row.dSelect" label-key="label" value-key="value" />
        </template>
      </SvTableColumn>
      <!-- @vue-generic {DemoListItem} -->
      <SvTableColumn prop="eSelect" label="数据项戊">
        <template #default="{ row }">
          <SvDictTag :dict-list="dict_e_select" :data="row.eSelect" label-key="label" value-key="value" />
        </template>
      </SvTableColumn>
      <!-- @vue-generic {DemoListItem} -->
      <SvTableColumn prop="fSelect" label="数据项己">
        <template #default="{ row }">
          <SvDictTag :dict-list="dict_f_select" :data="row.fSelect" label-key="label" value-key="value" />
        </template>
      </SvTableColumn>
      <!-- @vue-generic {DemoListItem} -->
      <SvTableColumn prop="gSelect" label="数据项庚">
        <template #default="{ row }">
          <SvDictTag :dict-list="dict_g_select" :data="row.gSelect" label-key="label" value-key="value" />
        </template>
      </SvTableColumn>
      <SvTableColumn prop="createdAt" label="创建日期" sortable />
      <!-- @vue-generic {DemoListItem} -->
      <SvTableColumn column-key="actions" label="操作" :width="132">
        <template #default="{ row }">
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm" @click="toUpdate(row)">修改</Button>
            <Button variant="ghost" size="sm" @click="toDelete(row)">删除</Button>
          </div>
        </template>
      </SvTableColumn>
    </SvTable>

    <!-- 表格分页栏 -->
    <SvTablePagination
      v-model:page-num="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      :selected="selectedList.length"
    />

    <!-- 新增 / 编辑弹窗 -->
    <ActionDialog ref="actionDialog" v-model:open="actionDialogOpen" :title="actionTitle" :mode="actionMode" @confirm="toConfirm" />

    <!-- 删除确认弹窗 -->
    <AlertDialog :open="pendingDeleteList.length > 0" @update:open="handleDeleteOpenChange">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除 {{ pendingDeleteList.length }} 条数据？</AlertDialogTitle>
          <AlertDialogDescription>此模板只打印删除请求，不会修改示例列表。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction @click="confirmDelete">确认删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, provide, shallowRef, useTemplateRef } from 'vue'
import { toast } from 'vue-sonner'
import {
  apiDemoAdd,
  apiDemoDelete,
  apiDemoExport,
  apiDemoImport,
  apiDemoList,
  apiDemoUpdate
} from '@/api/demo'
import type { DemoFilterValues, DemoFormValues, DemoListItem, DemoListParams } from '@/types/demo'
import SvDictTag from '@/components/SvDictTag/SvDictTag.vue'
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
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import ActionDialog from './components/ActionDialog.vue'
import FilterForm from './components/FilterForm.vue'
import { dict_d_select, dict_e_select, dict_f_select, dict_g_select } from './dict-data'

/** 页面统一向子组件提供字典。 */
provide('__DICT__', {
  dict_d_select,
  dict_e_select,
  dict_f_select,
  dict_g_select,
})

const dataList = shallowRef<DemoListItem[]>([])
const total = shallowRef(0)
const selectedList = shallowRef<DemoListItem[]>([])
const queryParams = shallowRef<DemoListParams>({
  aInput: '',
  bInput: '',
  cInput: '',
  dSelect: '',
  eSelect: '',
  fSelect: '',
  gSelect: '',
  id: '',
  createdRange: null,
  pageNum: 1,
  pageSize: 10
})
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const actionTitle = shallowRef('新增数据')
const actionMode = shallowRef<'add' | 'update'>('add')
const editingItem = shallowRef<DemoListItem | null>(null)
const pendingDeleteList = shallowRef<DemoListItem[]>([])
const actionDialog = useTemplateRef<InstanceType<typeof ActionDialog>>('actionDialog')

onMounted(toQuery)

/** 提交筛选条件并从第一页重新查询。 */
function toSearch(values: DemoFilterValues) {
  Object.assign(queryParams.value, values, { pageNum: 1 })
  toQuery()
}

/** 查询列表并更新表格数据和总数。 */
async function toQuery() {
  const response = await apiDemoList(queryParams.value)
  dataList.value = response.data || []
  total.value = response.total || 0
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
  editingItem.value = null
  actionDialog.value?.initForm()
  actionDialogOpen.value = true
}

/** 初始化并打开修改弹窗；未传行时使用表格单选项。 */
function toUpdate(item?: DemoListItem) {
  const target = item ?? selectedList.value[0]
  if (!target) {
    return
  }

  actionTitle.value = '修改数据'
  actionMode.value = 'update'
  editingItem.value = target
  actionDialog.value?.initForm(target)
  actionDialogOpen.value = true
}

/** 提交新增或修改请求。 */
function toConfirm(values: DemoFormValues) {
  if (editingItem.value) {
    apiDemoUpdate(editingItem.value.id, values)
    toast('修改请求已提交')
  } else {
    apiDemoAdd(values)
    toast('新增请求已提交')
  }

  actionDialogOpen.value = false
}

/** 打开删除确认弹窗，支持单行和已选数据。 */
function toDelete(item?: DemoListItem) {
  pendingDeleteList.value = item ? [item] : [...selectedList.value]
}

/** 提交删除请求并关闭确认弹窗。 */
function confirmDelete() {
  const idList = pendingDeleteList.value.map((item) => item.id)
  apiDemoDelete(idList)
  toast(`删除请求已提交，共 ${idList.length} 条数据`)
  pendingDeleteList.value = []
}

/** 清空待删除数据并关闭确认弹窗。 */
function handleDeleteOpenChange(open: boolean) {
  if (!open) {
    pendingDeleteList.value = []
  }
}

/** 导入操作占位，接入业务后在此调用导入 API。 */
function importList() {
  apiDemoImport()
}

/** 导出操作占位，接入业务后在此调用导出 API。 */
function exportList() {
  apiDemoExport()
}
</script>

<style lang="scss" scoped></style>
