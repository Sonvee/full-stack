<template>
  <section ref="containerRef" class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
    <header class="flex shrink-0 items-center justify-between gap-4">
      <h1 class="text-xl font-semibold">测试样例</h1>
      <SvFullscreen v-model:full="systemSettingStore.full" :container="containerRef" size="small" />
    </header>

    <!-- 条件筛选栏 -->
    <FilterForm v-show="showFilters" @search="toSearch" @reset="toReset" />

    <!-- 表格工具栏 -->
    <div class="flex shrink-0 flex-wrap items-center">
      <el-button type="primary" @click="toAdd"><i class="sv-icon-plus mr-2" />新增</el-button>
      <el-button type="danger" :disabled="selectedList.length === 0" @click="toDelete()"> <i class="sv-icon-delete mr-2" />删除 </el-button>
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
        <el-table-column type="selection" :width="50" align="center" fixed="left" />
        <el-table-column prop="index" label="排序" :width="80" align="center" />
        <el-table-column prop="name" label="测试名称" :min-width="160" show-overflow-tooltip />
        <el-table-column prop="description" label="测试描述" :min-width="200" show-overflow-tooltip />
        <el-table-column prop="icon" label="测试图标" :min-width="180" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <i v-if="row.icon" :class="row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="number" label="测试数字" :min-width="120" align="center" />
        <el-table-column prop="enabled" label="测试开关" :min-width="100" align="center">
          <template #default="{ row }">
            <SvDictTag :dict-list="dict_enabled" :data="row.enabled" label-key="label" value-key="value" />
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
        <el-table-column prop="id" label="数据编号" :min-width="280" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" :width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" :width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" :min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="操作" :width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="toUpdate(row as TestSampleListItem)">修改</el-button>
            <el-button type="danger" link @click="toDelete(row as TestSampleListItem)">删除</el-button>
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
import { apiTestSampleAdd, apiTestSampleDelete, apiTestSampleList, apiTestSampleUpdate } from '@/api/test-sample'
import { useSystemSettingStore } from '@/stores/system-setting'
import type { TestSampleListItem, TestSampleQueryParams } from '@/types/test-sample'
import { formatDateTime } from '@/utils/date-time'
import SvDictTag from '@/components/SvDictTag/SvDictTag.vue'
import SvFullscreen from '@/components/SvFullscreen/SvFullscreen.vue'
import SvPagination from '@/components/SvPagination/SvPagination.vue'
import ActionDialog from './components/ActionDialog.vue'
import FilterForm from './components/FilterForm.vue'
import { dict_enabled, dict_multi_select, dict_single_select } from './dict-data'

/** 页面统一向子组件提供字典。 */
provide('__DICT__', {
  dict_single_select,
  dict_multi_select,
  dict_enabled
})

const dataList = shallowRef<TestSampleListItem[]>([])
const loading = shallowRef(false)
const total = shallowRef(0)
const selectedList = shallowRef<TestSampleListItem[]>([])
const queryParams = ref<TestSampleQueryParams>({ pageNum: 1, pageSize: 20 })
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const actionLoading = shallowRef(false)
const actionTitle = shallowRef('新增测试样例')
const actionMode = shallowRef<'add' | 'update'>('add')
const actionDialogRef = useTemplateRef('actionDialogRef')
const containerRef = useTemplateRef('containerRef')
const systemSettingStore = useSystemSettingStore()

onMounted(() => {
  /** 页面加载时查询列表数据。 */
  toQuery()
})

/** 提交筛选条件并从第一页重新查询。 */
function toSearch(data: Omit<TestSampleQueryParams, 'pageNum' | 'pageSize'>) {
  queryParams.value = { ...queryParams.value, ...data, pageNum: 1 }
  toQuery()
}

/** 清除筛选条件并从第一页重新查询，保留每页条数。 */
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
    const res = await apiTestSampleList(queryParams.value)
    dataList.value = res.data ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 切换筛选栏显示状态。 */
function toToggleFilter() {
  showFilters.value = !showFilters.value
}

/** 记录当前选择的表格行。 */
function handleSelectionChange(rows: TestSampleListItem[]) {
  selectedList.value = rows
}

/** 初始化并打开新增弹窗。 */
function toAdd() {
  actionTitle.value = '新增测试样例'
  actionMode.value = 'add'
  actionDialogRef.value?.initForm()
  actionDialogOpen.value = true
}

/** 根据操作栏传入的行数据初始化并打开修改弹窗。 */
function toUpdate(row: TestSampleListItem) {
  actionTitle.value = '修改测试样例'
  actionMode.value = 'update'
  actionDialogRef.value?.initForm(row)
  actionDialogOpen.value = true
}

/** 新增或修改成功后关闭弹窗并刷新列表，新增时回到第一页。 */
async function toConfirm(data: TestSampleListItem) {
  if (actionLoading.value) return
  actionLoading.value = true
  try {
    if (actionMode.value === 'update') {
      const res = await apiTestSampleUpdate(data)
      ElMessage.success(res.message)
    } else {
      const res = await apiTestSampleAdd(data)
      queryParams.value.pageNum = 1
      ElMessage.success(res.message)
    }
    actionDialogOpen.value = false
    await toQuery()
  } finally {
    actionLoading.value = false
  }
}

/** 打开删除确认弹窗，请求成功后关闭弹窗并刷新列表。 */
async function toDelete(row?: TestSampleListItem) {
  const ids = (row ? [row] : selectedList.value).map((item) => item.id).filter((id) => id !== undefined)
  if (ids.length === 0) return
  try {
    await ElMessageBox.confirm(`删除后无法恢复，确认删除选中的 ${ids.length} 条数据？`, '确认删除', {
      confirmButtonText: '确认删除',
      confirmButtonType: 'danger',
      cancelButtonText: '取消',
      type: 'warning',
      async beforeClose(action, instance, done) {
        if (instance.confirmButtonLoading) return
        if (action !== 'confirm') {
          done()
          return
        }
        instance.confirmButtonLoading = true
        try {
          const res = await apiTestSampleDelete({ ids })
          ElMessage.success(res.message)
          const lastPage = Math.max(1, Math.ceil((total.value - (res.data?.deletedCount ?? 0)) / queryParams.value.pageSize))
          queryParams.value.pageNum = Math.min(queryParams.value.pageNum, lastPage)
          instance.action = 'confirm'
          done()
        } catch {
          // 请求工具统一提示错误，删除失败时保留确认框。
        } finally {
          instance.confirmButtonLoading = false
        }
      }
    })
  } catch {
    return
  }
  await toQuery()
}
</script>

<style lang="scss" scoped></style>
