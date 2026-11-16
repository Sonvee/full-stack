<template>
  <section ref="containerRef" class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
    <header class="flex shrink-0 items-center justify-between gap-4">
      <h1 class="text-xl font-semibold">字典管理</h1>
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
        <el-table-column prop="name" label="字典名称" :min-width="160" show-overflow-tooltip />
        <el-table-column prop="type" label="字典类型" :min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <el-button type="primary" link title="管理字典数据" @click="toDetail(row as DictionaryListItem)">{{ row.type }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" :width="100" align="center">
          <template #default="{ row }">
            <SvDictTag :dict-list="sys_status" :data="row.status" label-key="label" value-key="value" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" :min-width="200" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" :width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" :width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" :width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="toUpdate(row as DictionaryListItem)">修改</el-button>
            <el-button type="danger" link @click="toDelete(row as DictionaryListItem)">删除</el-button>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiDictionaryAdd, apiDictionaryDelete, apiDictionaryList, apiDictionaryUpdate } from '@/api/dictionary'
import { useSystemSettingStore } from '@/stores/system-setting'
import type { DictionaryListItem, DictionaryQueryParams } from '@/types/dictionary'
import { formatDateTime } from '@/utils/date-time'
import SvDictTag from '@/components/SvDictTag/SvDictTag.vue'
import SvFullscreen from '@/components/SvFullscreen/SvFullscreen.vue'
import SvPagination from '@/components/SvPagination/SvPagination.vue'
import ActionDialog from './components/ActionDialog.vue'
import FilterForm from './components/FilterForm.vue'
import { sys_status } from './dict-data'

/** 页面统一向子组件提供字典。 */
provide('__DICT__', {
  sys_status
})

const router = useRouter()
const dataList = shallowRef<DictionaryListItem[]>([])
const loading = shallowRef(false)
const total = shallowRef(0)
const selectedList = shallowRef<DictionaryListItem[]>([])
const queryParams = ref<DictionaryQueryParams>({ pageNum: 1, pageSize: 20 })
const showFilters = shallowRef(true)
const actionDialogOpen = shallowRef(false)
const actionLoading = shallowRef(false)
const actionTitle = shallowRef('新增字典')
const actionMode = shallowRef<'add' | 'update'>('add')
const actionDialogRef = useTemplateRef('actionDialogRef')
const containerRef = useTemplateRef('containerRef')
const systemSettingStore = useSystemSettingStore()

onMounted(() => {
  /** 页面加载时查询列表数据。 */
  toQuery()
})

/** 提交筛选条件并从第一页重新查询。 */
function toSearch(data: Omit<DictionaryQueryParams, 'pageNum' | 'pageSize'>) {
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
    const res = await apiDictionaryList(queryParams.value)
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
function handleSelectionChange(rows: DictionaryListItem[]) {
  selectedList.value = rows
}

/** 初始化并打开新增弹窗。 */
function toAdd() {
  actionTitle.value = '新增字典'
  actionMode.value = 'add'
  actionDialogRef.value?.initForm()
  actionDialogOpen.value = true
}

/** 根据操作栏传入的行数据初始化并打开修改弹窗。 */
function toUpdate(row: DictionaryListItem) {
  actionTitle.value = '修改字典'
  actionMode.value = 'update'
  actionDialogRef.value?.initForm(row)
  actionDialogOpen.value = true
}

/** 打开当前字典的数据管理子页面。 */
function toDetail(row: DictionaryListItem) {
  void router.push({ name: 'admin-dict-detail', params: { dictionaryId: row.id } })
}

/** 新增或修改成功后关闭弹窗并刷新列表，新增时回到第一页。 */
async function toConfirm(data: DictionaryListItem) {
  if (actionLoading.value) return
  actionLoading.value = true
  try {
    if (actionMode.value === 'update') {
      const res = await apiDictionaryUpdate(data)
      ElMessage.success(res.message)
    } else {
      const res = await apiDictionaryAdd(data)
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
async function toDelete(row?: DictionaryListItem) {
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
          const res = await apiDictionaryDelete({ ids })
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
