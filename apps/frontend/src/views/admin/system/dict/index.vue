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
      <el-button type="primary" @click="toAdd">
        <template #icon>
          <i class="sv-icon-plus" />
        </template>
        新增
      </el-button>
      <el-button type="danger" :disabled="selectedList.length === 0" @click="toDelete()">
        <template #icon>
          <i class="sv-icon-delete" />
        </template>
        删除
      </el-button>
      <span class="min-w-0 flex-1" />
      <el-button circle title="刷新" @click="toQuery">
        <template #icon>
          <i class="sv-icon-refresh" />
        </template>
      </el-button>
      <el-button circle :title="showFilters ? '隐藏筛选' : '显示筛选'" @click="toToggleFilter">
        <template #icon>
          <i :class="showFilters ? 'sv-icon-filterremove' : 'sv-icon-filter'" />
        </template>
      </el-button>
    </div>

    <!-- 数据表格 -->
    <div class="min-h-0 flex-1 overflow-hidden rounded-lg border">
      <el-table v-loading="loading" :data="dataList" row-key="id" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :width="50" align="center" fixed="left" />
        <el-table-column prop="name" label="字典名称" :min-width="160" show-overflow-tooltip />
        <el-table-column prop="dictType" label="字典类型" :min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="flex items-center">
              <el-button type="primary" link @click="toDetail(row as DictListItem)">
                {{ row.dictType }}
              </el-button>
              <el-button type="primary" link class="shrink-0" title="复制字典类型" @click.stop="toCopy(row.dictType)">
                <template #icon>
                  <i class="sv-icon-contentcopy" />
                </template>
              </el-button>
            </div>
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
            <el-button type="primary" link @click="toUpdate(row as DictListItem)">修改</el-button>
            <el-button type="danger" link @click="toDelete(row as DictListItem)">删除</el-button>
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
import { useClipboard } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiDictAdd, apiDictDelete, apiDictList, apiDictUpdate } from '@/api/dict'
import { useSystemSettingStore } from '@/stores/system-setting'
import type { DictListItem, DictQueryParams } from '@/types/dict'
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
const { copy, isSupported } = useClipboard()
const dataList = shallowRef<DictListItem[]>([])
const loading = shallowRef(false)
const total = shallowRef(0)
const selectedList = shallowRef<DictListItem[]>([])
const queryParams = ref<DictQueryParams>({ pageNum: 1, pageSize: 20 })
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
function toSearch(data: Omit<DictQueryParams, 'pageNum' | 'pageSize'>) {
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
    const res = await apiDictList(queryParams.value)
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
function handleSelectionChange(rows: DictListItem[]) {
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
function toUpdate(row: DictListItem) {
  actionTitle.value = '修改字典'
  actionMode.value = 'update'
  actionDialogRef.value?.initForm(row)
  actionDialogOpen.value = true
}

/** 打开当前字典的数据管理子页面。 */
function toDetail(row: DictListItem) {
  void router.push({ name: 'admin-dict-detail', params: { dictType: row.dictType } })
}

/** 复制当前行的字典类型。 */
async function toCopy(dictType: string) {
  if (!isSupported.value) {
    ElMessage.error('当前浏览器不支持剪贴板复制')
    return
  }

  try {
    await copy(dictType)
    ElMessage.success('字典类型已复制')
  } catch {
    ElMessage.error('复制失败，请检查浏览器剪贴板权限')
  }
}

/** 新增或修改成功后关闭弹窗并刷新列表，新增时回到第一页。 */
async function toConfirm(data: DictListItem) {
  if (actionLoading.value) return
  actionLoading.value = true
  try {
    if (actionMode.value === 'update') {
      const res = await apiDictUpdate(data)
      ElMessage.success(res.message)
    } else {
      const res = await apiDictAdd(data)
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
async function toDelete(row?: DictListItem) {
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
          const res = await apiDictDelete({ ids })
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
