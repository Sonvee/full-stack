<template>
  <section class="flex min-h-0 flex-1 flex-col gap-4">
    <header class="flex shrink-0 items-center justify-between gap-2">
      <h1 class="text-xl font-semibold">CRUD 模板</h1>
    </header>

    <!-- 条件筛选栏 -->
    <FilterForm v-show="showFilters" @search="toSearch" @reset="toReset" />

    <!-- 表格工具栏 -->
    <div class="flex shrink-0 flex-wrap items-center">
      <el-button type="primary" @click="toAdd"><i class="sv-icon-plus mr-2" />新增</el-button>
      <el-button type="danger" :disabled="selectedList.length === 0" @click="toDelete()"><i class="sv-icon-delete mr-2" />删除</el-button>
      <el-button @click="importList"><i class="sv-icon-import mr-2" />导入</el-button>
      <el-button @click="exportList"><i class="sv-icon-export mr-2" />导出</el-button>
      <span class="min-w-0 flex-1" />
      <el-button circle title="刷新" @click="toQuery">
        <i class="sv-icon-refresh" />
      </el-button>
      <el-button circle :title="showFilters ? '隐藏筛选' : '显示筛选'" @click="toToggleFilter">
        <i :class="showFilters ? 'sv-icon-filterremove' : 'sv-icon-filter'" />
      </el-button>
    </div>

    <!-- 数据表格 -->
    <div class="min-h-0 flex-1 overflow-hidden rounded-lg border">
      <el-table v-loading="loading" :data="dataList" row-key="id" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :width="48" align="center" fixed="left" reserve-selection />
        <el-table-column prop="id" label="数据编号" :min-width="120" show-overflow-tooltip />
        <el-table-column prop="aInput" label="数据项甲" :min-width="120" show-overflow-tooltip />
        <el-table-column prop="bInput" label="数据项乙" :min-width="120" show-overflow-tooltip />
        <el-table-column prop="cInput" label="数据项丙" :min-width="120" show-overflow-tooltip />
        <el-table-column prop="dSelect" label="数据项丁" :min-width="100" align="center">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_d_select" :data="row.dSelect" label-key="label" value-key="value" />
          </template>
        </el-table-column>
        <el-table-column prop="eSelect" label="数据项戊" :min-width="100" align="center">
          <template #default="{ row }">
            <div class="flex flex-wrap justify-center gap-1">
              <SvDictTag
                v-for="item in row.eSelect"
                :key="item"
                :dict-list="dict_e_select"
                :data="item"
                label-key="label"
                value-key="value"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fSelect" label="数据项己" :min-width="100" align="center">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_f_select" :data="row.fSelect" label-key="label" value-key="value" />
          </template>
        </el-table-column>
        <el-table-column prop="gSelect" label="数据项庚" :min-width="100" align="center">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_g_select" :data="row.gSelect" label-key="label" value-key="value" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建日期" :min-width="200" align="center" show-overflow-tooltip />
        <el-table-column label="操作" :width="132" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="toUpdate(row as DemoListItem)">修改</el-button>
            <el-button type="danger" link @click="toDelete(row as DemoListItem)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 表格分页栏 -->
    <footer class="flex shrink-0 flex-wrap items-center justify-between">
      <p class="text-sm text-muted-foreground">已选择 {{ selectedList.length }} 条</p>
      <div class="max-w-full overflow-x-auto">
        <SvPagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </footer>

    <!-- 新增 / 编辑弹窗 -->
    <ActionDialog
      ref="actionDialogRef"
      v-model:open="actionDialogOpen"
      :title="actionTitle"
      :mode="actionMode"
      :loading="actionLoading"
      @confirm="toConfirm"
    />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, shallowRef, useTemplateRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiDemoAdd, apiDemoDelete, apiDemoExport, apiDemoImport, apiDemoList, apiDemoUpdate } from '@/api/demo'
import type { DemoDeleteParams, DemoListItem, DemoQueryParams } from '@/types/demo'
import SvDictTag from '@/components/SvDictTag/SvDictTag.vue'
import SvPagination from '@/components/SvPagination/SvPagination.vue'
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
const loading = shallowRef(false)
const total = shallowRef(0)
const selectedList = shallowRef<DemoListItem[]>([])
const queryParams = ref<DemoQueryParams>({
  aInput: '',
  bInput: '',
  cInput: '',
  dSelect: '',
  eSelect: [],
  fSelect: '',
  gSelect: '',
  createdRange: null,
  pageNum: 1,
  pageSize: 10
})
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const actionLoading = shallowRef(false)
const actionTitle = shallowRef('新增数据')
const actionMode = shallowRef<'add' | 'update'>('add')
const actionDialogRef = useTemplateRef('actionDialogRef')

onMounted(() => {
  /** 页面加载时查询列表数据。 */
  toQuery()
})

/** 提交筛选条件并从第一页重新查询。 */
function toSearch(data: Omit<DemoQueryParams, 'pageNum' | 'pageSize'>) {
  queryParams.value = { ...queryParams.value, ...data, pageNum: 1 }
  toQuery()
}

/** 清除筛选条件并从第一页重新查询。 */
function toReset() {
  queryParams.value = { pageNum: 1, pageSize: queryParams.value.pageSize }
  toQuery()
}

/** 页码切换后查询对应页面的数据。 */
function handleCurrentChange() {
  toQuery()
}

/** 每页条数切换后从第一页重新查询。 */
function handleSizeChange() {
  queryParams.value.pageNum = 1
  toQuery()
}

/** 查询列表并更新表格数据和总数。 */
async function toQuery() {
  loading.value = true
  try {
    const res = await apiDemoList(queryParams.value)
    dataList.value = res.data || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
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

/** 新增或修改成功后关闭弹窗并刷新列表。 */
async function toConfirm(data: DemoListItem) {
  if (actionLoading.value) return
  actionLoading.value = true
  try {
    if (actionMode.value === 'update') {
      await apiDemoUpdate(data)
      ElMessage.success('修改请求已提交')
    } else {
      await apiDemoAdd(data)
      ElMessage.success('新增请求已提交')
    }
    actionDialogOpen.value = false
    await toQuery()
  } finally {
    actionLoading.value = false
  }
}

/** 打开删除确认弹窗，支持单行和已选数据。 */
async function toDelete(row?: DemoListItem) {
  const data: DemoDeleteParams = {
    ids: (row ? [row] : selectedList.value).map(item => item.id).filter(id => id !== undefined)
  }
  const count = data.ids.length
  try {
    await ElMessageBox.confirm('此模板只打印删除请求，不会修改示例列表。', `确认删除 ${count} 条数据？`, {
      confirmButtonText: '确认删除',
      confirmButtonType: 'danger',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  await apiDemoDelete(data)
  ElMessage.success(`删除请求已提交，共 ${count} 条数据`)
  await toQuery()
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
