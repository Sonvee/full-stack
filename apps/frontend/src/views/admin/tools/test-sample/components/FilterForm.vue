<template>
  <section
    class="filter-form flex min-h-0 min-w-0 max-h-[70%] flex-col rounded-lg border p-4"
    :class="{ 'is-expanded': expanded }"
  >
    <el-form
      ref="filterFormRef"
      :model="formData"
      label-width="auto"
      label-position="right"
      class="flex min-h-0 min-w-0 flex-col"
      @submit.prevent="toConfirm"
    >
      <div class="filter-form-grid grid min-w-0 overflow-x-hidden overflow-y-auto gap-4 p-1">
        <el-form-item prop="name" label="测试名称">
          <el-input
            v-model.trim="formData.name"
            clearable
            placeholder="请输入测试名称"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item prop="description" label="测试描述">
          <el-input
            v-model.trim="formData.description"
            clearable
            placeholder="请输入测试描述"
            :maxlength="2000"
          />
        </el-form-item>
        <el-form-item prop="enabled" label="测试开关">
          <SvDictSelect
            v-model="formData.enabled"
            :dict-list="dict_enabled"
            label-key="label"
            value-key="value"
            placeholder="全部"
            clearable
          />
        </el-form-item>
        <el-form-item prop="singleSelect" label="测试单选">
          <SvDictSelect
            v-model="formData.singleSelect"
            :dict-list="dict_single_select"
            label-key="label"
            value-key="value"
            placeholder="全部"
            clearable
          />
        </el-form-item>
        <el-form-item prop="multiSelect" label="测试多选">
          <SvDictSelect
            v-model="formData.multiSelect"
            :dict-list="dict_multi_select"
            label-key="label"
            value-key="value"
            placeholder="包含全部已选项"
            multiple
            clearable
          />
        </el-form-item>
        <el-form-item prop="numberRange" label="数字范围">
          <el-slider
            v-model="formData.numberRange"
            range
            :min="0"
            :max="999"
            :step="1"
            class="mx-3 flex-1"
          />
        </el-form-item>
        <el-form-item prop="icon" label="测试图标">
          <SvIconSelect v-model="formData.icon" placeholder="全部" clearable />
        </el-form-item>
        <el-form-item prop="operator" label="操作人">
          <el-input
            v-model.trim="formData.operator"
            clearable
            placeholder="请输入操作人"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item prop="createdRange" label="创建时间">
          <SvDateTimePicker v-model="formData.createdRange" />
        </el-form-item>
        <el-form-item prop="updatedRange" label="更新时间">
          <SvDateTimePicker v-model="formData.updatedRange" />
        </el-form-item>
        <div
          class="filter-form-actions flex min-w-0 flex-wrap items-center justify-end gap-2 self-end [&>.el-button]:ml-0!"
        >
          <el-button native-type="submit" type="primary"
            ><i class="sv-icon-magnify mr-2" />查询</el-button
          >
          <el-button @click="reset"><i class="sv-icon-reload mr-2" />重置</el-button>
          <el-button class="filter-form-toggle" text @click="expanded = !expanded">
            {{ expanded ? '收起条件' : '展开条件' }}
            <i class="ml-2" :class="expanded ? 'sv-icon-chevronup' : 'sv-icon-chevrondown'" />
          </el-button>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script lang="ts" setup>
import { ref, shallowRef, useTemplateRef } from 'vue'
import { cloneDeep } from 'es-toolkit'
import SvDateTimePicker from '@/components/SvDateTimePicker/SvDateTimePicker.vue'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import SvIconSelect from '@/components/SvIconSelect/SvIconSelect.vue'
import type { TestSampleQueryParams } from '@/types/test-sample'
import { dict_enabled, dict_multi_select, dict_single_select } from '../dict-data'

const emit = defineEmits<{
  search: [filters: Omit<TestSampleQueryParams, 'pageNum' | 'pageSize'>]
  reset: []
}>()

/** 默认筛选条件，pageNum 与 pageSize 由父页面管理。 */
const defaultFilters: Omit<TestSampleQueryParams, 'pageNum' | 'pageSize'> = {
  name: '',
  description: '',
  icon: '',
  numberRange: [0, 999],
  enabled: '',
  singleSelect: '',
  multiSelect: [],
  operator: '',
  createdRange: null,
  updatedRange: null,
}
/** 筛选条件草稿，查询时再提交给父页面。 */
const formData = ref(cloneDeep(defaultFilters))
const filterFormRef = useTemplateRef('filterFormRef')
const expanded = shallowRef(false)

/** 提交当前筛选条件的副本，避免后续输入影响已经提交的条件。 */
function toConfirm() {
  emit('search', cloneDeep(formData.value))
}

/** 重置表单草稿和校验状态，并通知父页面清除已提交的筛选条件。 */
function reset() {
  formData.value = cloneDeep(defaultFilters)
  filterFormRef.value?.clearValidate()
  emit('reset')
}
</script>

<style lang="scss" scoped>
.filter-form {
  container-name: filter-form;
  container-type: inline-size;
}

.filter-form-toggle {
  display: none;
}

.filter-form-actions {
  grid-column: -2 / -1;
}

.filter-form-grid > .el-form-item {
  min-width: 0;
  margin-bottom: 0;
}

// $columns 控制每行的等宽列数，操作区也占一格；收起时最多显示两行，并为操作区预留末格。
@mixin filter-columns($columns) {
  // 从第 $columns * 2 个字段开始折叠；存在该字段时显示展开按钮。
  $overflow-start: $columns * 2;

  :deep(.filter-form-grid) {
    grid-template-columns: repeat($columns, minmax(0, 1fr));
  }

  .filter-form:not(.is-expanded)
    :deep(.filter-form-grid > .el-form-item:nth-child(n + #{$overflow-start})) {
    display: none;
  }

  .filter-form:has(.filter-form-grid > .el-form-item:nth-child(#{$overflow-start}))
    .filter-form-toggle {
    display: inline-flex;
  }
}

// 默认四列；以下按 filter-form 容器宽度调整列数，非浏览器窗口宽度。
@include filter-columns(4);

// 容器宽度 < 29rem：一列。
@container filter-form (width < 29rem) {
  @include filter-columns(1);
}

// 29rem <= 容器宽度 < 44rem：两列。
@container filter-form (29rem <= width < 44rem) {
  @include filter-columns(2);
}

// 44rem <= 容器宽度 < 59rem：三列；达到 59rem 后使用默认四列。
@container filter-form (44rem <= width < 59rem) {
  @include filter-columns(3);
}
</style>
