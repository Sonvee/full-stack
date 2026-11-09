<template>
  <div class="page-container">
    <!-- 搜索筛选栏 -->
    <SearchFilter v-show="showFilter" @query="toSearch"></SearchFilter>

    <el-divider v-show="showFilter" border-style="dashed" class="page-divider" />

    <!-- 表头操作栏 -->
    <div class="table-header">
      <el-button plain :icon="Plus" type="primary" @click="toAdd">新增</el-button>
      <el-button plain :icon="Edit" type="info" :disabled="selectionList.length !== 1" @click="toUpdate()">修改</el-button>
      <el-button plain :icon="Delete" type="danger" :disabled="selectionList.length <= 0" @click="toDelete()">删除</el-button>
      <div class="table-header__spacer"></div>
      <el-button
        plain
        :icon="showFilter ? Hide : View"
        circle
        :title="showFilter ? '隐藏筛选' : '显示筛选'"
        :aria-label="showFilter ? '隐藏筛选' : '显示筛选'"
        @click="toToggleFilter"
      ></el-button>
      <el-button plain :icon="Refresh" circle title="刷新" @click="toRefresh"></el-button>
    </div>

    <!-- 数据表格 -->
    <el-table :data="tableData" v-loading="loading" border class="data-table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" fixed="left" />
      <el-table-column prop="id" label="ID" min-width="100" fixed="left" show-overflow-tooltip />
      <el-table-column prop="text" label="文本" min-width="200" show-overflow-tooltip />
      <el-table-column prop="textRequired" label="必填文本" min-width="200" show-overflow-tooltip />
      <el-table-column prop="option" label="选项" min-width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="optionRange" label="选项范围" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="date" label="日期" min-width="150" align="center" show-overflow-tooltip />
      <el-table-column prop="dateRange" label="日期范围" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="datetime" label="时间" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="datetimeRange" label="时间范围" min-width="350" align="center" show-overflow-tooltip />
      <el-table-column prop="num" label="数字" min-width="100" sortable show-overflow-tooltip />
      <el-table-column prop="sliderRange" label="滑块范围" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" min-width="100" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <DictTag :dict-list="sys_status" :data="row.status" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="scope">
          <el-button link :icon="Edit" type="primary" @click="toUpdate(scope.row)">修改</el-button>
          <el-button link :icon="Delete" type="danger" @click="toDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗 -->
    <ActionPopup v-model="apOpen" :title="apTitle" :mode="apMode" ref="apRef" @confirm="toConfirm"></ActionPopup>

    <!-- 表格分页 -->
    <TablePagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize" :total="total"></TablePagination>
  </div>
</template>

<script lang="ts" setup>
import SearchFilter from './components/SearchFilter.vue'
import ActionPopup from './components/ActionPopup.vue'
import { Delete, Edit, Hide, Plus, Refresh, View } from '@element-plus/icons-vue'
import { apiDemoList as apiQuery, apiDemoAdd as apiAdd, apiDemoUpdate as apiUpdate, apiDemoDelete as apiDelete } from '@/api/demo'
import type { DemoActionMode, DemoFormModel, DemoQueryParams, DemoRecord, DemoSearchForm } from '@/types/demo'

definePageMeta({
  title: '模板样例',
  layout: 'admin',
  keepalive: true
})

// 字典
const { sys_status } = useDict('sys_status')
provide('__DICT__', { sys_status })

/**
 * 创建列表查询参数默认值。
 *
 * 模板页将筛选条件与分页参数放在同一对象中，方便替换为真实列表接口。
 */
function createDefaultQueryParams(): DemoQueryParams {
  return {
    text: '',
    textRequired: '',
    option: '',
    optionRange: [],
    date: '',
    dateRange: [],
    datetime: '',
    datetimeRange: [],
    num: 0,
    sliderRange: [25, 75],
    status: 'enabled',
    pageSize: 20,
    pageNum: 1
  }
}

const queryParams = ref<DemoQueryParams>(createDefaultQueryParams())
const tableData = ref<DemoRecord[]>([])
const total = ref(0)
const loading = ref(false)
const selectionList = ref<DemoRecord[]>([])
const showFilter = shallowRef(true)

const apRef = useTemplateRef('apRef')
const apOpen = ref(false)
const apTitle = ref('新增')
const apMode = ref<DemoActionMode>('add')

onMounted(async () => {
  toQuery()
})

/**
 * 记录表格多选数据，供批量删除和批量操作使用。
 *
 * @param rows - 当前选中的表格行。
 */
function handleSelectionChange(rows: DemoRecord[]) {
  selectionList.value = rows
}

/**
 * 合并搜索栏筛选条件并重新查询列表。
 *
 * @param params - 搜索筛选栏提交的表单参数。
 */
function toSearch(params: DemoSearchForm) {
  Object.assign(queryParams.value, params, {
    pageNum: 1
  })
  toQuery()
}

/**
 * 查询表格数据。
 *
 * 当前使用前端静态模拟接口，后续接入后端时保持这里作为列表查询入口。
 */
async function toQuery() {
  loading.value = true

  try {
    const res = await apiQuery(queryParams.value)
    tableData.value = res.data || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

/**
 * 使用当前查询参数刷新列表。
 */
function toRefresh() {
  toQuery()
}

/**
 * 切换搜索筛选栏显示状态。
 */
function toToggleFilter() {
  showFilter.value = !showFilter.value
}

/**
 * 打开新增弹窗。
 */
function toAdd() {
  apTitle.value = '新增'
  apMode.value = 'add'
  apRef.value?.initForm({})
  apOpen.value = true
}

/**
 * 打开编辑弹窗。
 *
 * @param row - 表格行操作传入的记录；工具栏操作未传入时使用单选记录。
 */
function toUpdate(row?: unknown) {
  const target = (row as DemoRecord | undefined) ?? selectionList.value[0]

  if (!target) return

  apTitle.value = '修改'
  apMode.value = 'edit'
  apRef.value?.initForm(target)
  apOpen.value = true
}

/**
 * 处理新增或编辑弹窗确认。
 *
 * @param form - 已通过弹窗校验的表单数据。
 */
async function toConfirm(form: DemoFormModel) {
  const res = apMode.value === 'edit' ? await apiUpdate(form) : await apiAdd(form)

  ElMessage.success(res.msg)
  apOpen.value = false
  toRefresh()
}

/**
 * 删除单条或当前选中的多条数据。
 *
 * @param row - 表格行操作传入的记录；工具栏操作未传入时使用多选记录。
 */
function toDelete(row?: unknown) {
  const rows = row ? [row as DemoRecord] : selectionList.value

  if (rows.length === 0) return

  ElMessageBox.confirm('此操作将删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await apiDelete(rows.map((item) => item.id))
      ElMessage.success('删除成功')
      toRefresh()
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
</style>
