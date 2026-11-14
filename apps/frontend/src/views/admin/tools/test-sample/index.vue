<template>
  <section ref="containerRef" class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
    <header class="flex shrink-0 items-center justify-between gap-4">
      <h1 class="text-xl font-semibold">测试样例</h1>
      <SvFullscreen v-model:full="systemSettingStore.full" :container="containerRef" size="small" f11 />
    </header>

    <!-- 条件筛选栏 -->
    <FilterForm v-show="showFilters" @search="toSearch" @reset="toReset" />

    <!-- 表格工具栏 -->
    <div class="flex shrink-0 flex-wrap items-center">
      <el-button type="primary" @click="toAdd"><i class="sv-icon-plus mr-2" />新增</el-button>
      <el-button type="danger" :disabled="selectedList.length === 0" :loading="deleting" @click="toDelete()">
        <i class="sv-icon-delete mr-2" />删除
      </el-button>
      <span class="min-w-0 flex-1" />
      <el-button circle title="刷新" :loading="loading" @click="toQuery"><i class="sv-icon-refresh" /></el-button>
      <el-button circle :title="showFilters ? '隐藏筛选' : '显示筛选'" @click="showFilters = !showFilters">
        <i :class="showFilters ? 'sv-icon-filterremove' : 'sv-icon-filter'" />
      </el-button>
    </div>

    <!-- 数据表格 -->
    <div class="min-h-0 flex-1 overflow-hidden rounded-lg border">
      <el-table ref="tableRef" v-loading="loading" :data="dataList" row-key="id" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :width="48" align="center" fixed="left" />
        <el-table-column prop="index" label="排序" :width="90" align="center" />
        <el-table-column prop="name" label="测试名称" :min-width="160" show-overflow-tooltip />
        <el-table-column prop="description" label="测试描述" :min-width="200" show-overflow-tooltip />
        <el-table-column prop="icon" label="测试图标" :min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span v-if="row.icon" class="inline-flex items-center gap-2"> <i :class="row.icon" />{{ row.icon }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="测试数字" :min-width="120" align="right" />
        <el-table-column prop="enabled" label="测试开关" :min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '开启' : '关闭' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="singleSelect" label="测试单选" :min-width="120" align="center">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_single_select" :data="row.singleSelect" label-key="label" value-key="value" />
          </template>
        </el-table-column>
        <el-table-column prop="multiSelect" label="测试多选" :min-width="180" align="center">
          <template #default="{ row }">
            <div class="flex flex-wrap justify-center gap-1">
              <SvDictTag
                v-for="item in row.multiSelect"
                :key="item"
                :dict-list="dict_multi_select"
                :data="item"
                label-key="label"
                value-key="value"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" :min-width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" :min-width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" :min-width="120" show-overflow-tooltip />
        <el-table-column prop="id" label="数据编号" :min-width="280" show-overflow-tooltip />
        <el-table-column label="操作" :width="132" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="toUpdate(row as TestSampleListItem)">修改</el-button>
            <el-button type="danger" link :disabled="deleting" @click="toDelete(row as TestSampleListItem)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty :description="loadError ? '加载失败，请点击刷新重试' : '暂无测试样例'" />
        </template>
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
          @current-change="toQuery"
          @size-change="handleSizeChange"
        />
      </div>
    </footer>

    <!-- 新增 / 编辑弹窗 -->
    <ActionDialog
      ref="actionDialogRef"
      v-model:open="actionDialogOpen"
      :mode="editingId ? 'update' : 'add'"
      :loading="actionLoading"
      @confirm="toConfirm"
    />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, shallowRef, useTemplateRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiTestSampleAdd, apiTestSampleDelete, apiTestSampleList, apiTestSampleUpdate } from '@/api/test-sample'
import { useSystemSettingStore } from '@/stores/system-setting'
import type { TestSampleListItem, TestSampleQueryParams } from '@/types/test-sample'
import { formatDateTime } from '@/utils/date-time'
import SvDictTag from '@/components/SvDictTag/SvDictTag.vue'
import SvFullscreen from '@/components/SvFullscreen/SvFullscreen.vue'
import SvPagination from '@/components/SvPagination/SvPagination.vue'
import ActionDialog from './components/ActionDialog.vue'
import FilterForm from './components/FilterForm.vue'
import { dict_multi_select, dict_single_select } from './dict-data'

const systemSettingStore = useSystemSettingStore()
const containerRef = useTemplateRef('containerRef')
const tableRef = useTemplateRef('tableRef')
const actionDialogRef = useTemplateRef('actionDialogRef')
const dataList = shallowRef<TestSampleListItem[]>([])
const selectedList = shallowRef<TestSampleListItem[]>([])
const total = shallowRef(0)
const loading = shallowRef(false)
const loadError = shallowRef(false)
const deleting = shallowRef(false)
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const actionLoading = shallowRef(false)
const editingId = shallowRef<string>()
const queryParams = ref<TestSampleQueryParams>({ pageNum: 1, pageSize: 10 })
let querySequence = 0

/** 页面加载时查询测试样例列表。 */
onMounted(toQuery)

/** 提交筛选条件并从第一页重新查询。 */
function toSearch(filters: Omit<TestSampleQueryParams, 'pageNum' | 'pageSize'>) {
  queryParams.value = { ...filters, pageNum: 1, pageSize: queryParams.value.pageSize }
  void toQuery()
}

/** 清除筛选条件并从第一页重新查询，保留每页条数。 */
function toReset() {
  queryParams.value = { pageNum: 1, pageSize: queryParams.value.pageSize }
  void toQuery()
}

/** 每页条数切换后从第一页重新查询。 */
function handleSizeChange() {
  queryParams.value.pageNum = 1
  void toQuery()
}

/** 查询列表并更新表格数据和总数；快速切页时只接收最后一次查询的结果。 */
async function toQuery() {
  const sequence = ++querySequence
  loading.value = true
  loadError.value = false
  try {
    const res = await apiTestSampleList(queryParams.value)
    if (sequence !== querySequence) return
    dataList.value = res.data
    total.value = res.total ?? 0
    tableRef.value?.clearSelection()
  } catch {
    if (sequence !== querySequence) return
    dataList.value = []
    total.value = 0
    loadError.value = true
    tableRef.value?.clearSelection()
  } finally {
    if (sequence === querySequence) {
      loading.value = false
    }
  }
}

/** 记录当前选择的表格行，供批量删除使用。 */
function handleSelectionChange(rows: TestSampleListItem[]) {
  selectedList.value = rows
}

/** 清除编辑编号，初始化并打开新增弹窗。 */
function toAdd() {
  editingId.value = undefined
  void actionDialogRef.value?.initForm()
  actionDialogOpen.value = true
}

/** 记录编辑编号，根据行数据初始化并打开修改弹窗。 */
function toUpdate(row: TestSampleListItem) {
  editingId.value = row.id
  void actionDialogRef.value?.initForm(row)
  actionDialogOpen.value = true
}

/** 新增或修改成功后关闭弹窗并刷新列表，新增时回到第一页。 */
async function toConfirm(data: TestSampleListItem) {
  if (actionLoading.value) return
  actionLoading.value = true
  try {
    if (editingId.value) {
      await apiTestSampleUpdate({ ...data, id: editingId.value })
      ElMessage.success('修改成功')
    } else {
      await apiTestSampleAdd(data)
      queryParams.value.pageNum = 1
      ElMessage.success('新增成功')
    }
    actionDialogOpen.value = false
    await toQuery()
  } catch {
    // 请求工具统一提示错误，保存失败时保留表单。
  } finally {
    actionLoading.value = false
  }
}

/** 确认后删除单行或已选数据，删除成功后将页码调整到有效范围并刷新列表。 */
async function toDelete(row?: TestSampleListItem) {
  if (deleting.value) return
  const ids = (row ? [row] : selectedList.value).map((item) => item.id).filter((id) => id !== undefined)
  if (ids.length === 0) return
  deleting.value = true
  try {
    await ElMessageBox.confirm(`删除后无法恢复，确认删除选中的 ${ids.length} 条测试样例？`, '确认删除', {
      confirmButtonText: '确认删除',
      confirmButtonType: 'danger',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await apiTestSampleDelete({ ids })
    ElMessage.success(`已删除 ${res.data.deletedCount} 条测试样例`)
    const lastPage = Math.max(1, Math.ceil((total.value - res.data.deletedCount) / queryParams.value.pageSize))
    queryParams.value.pageNum = Math.min(queryParams.value.pageNum, lastPage)
    await toQuery()
  } catch {
    // 取消确认时保留列表；请求错误由请求工具统一提示。
  } finally {
    deleting.value = false
  }
}

</script>

<style lang="scss" scoped></style>
