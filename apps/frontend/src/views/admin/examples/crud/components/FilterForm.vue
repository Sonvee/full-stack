<template>
  <section class="filter-form flex min-h-0 min-w-0 max-h-[70%] flex-col rounded-lg border p-4" :class="{ 'is-expanded': expanded }">
    <SvForm
      ref="filterFormRef"
      v-model:model="formData"
      label-width="auto"
      label-position="right"
      class="flex min-h-0 min-w-0 flex-col"
      content-class="filter-form-grid grid min-w-0 overflow-x-hidden overflow-y-auto gap-4 p-1"
    >
      <SvFormItem prop="aInput" label="数据项甲">
        <SvInput v-model="formData.aInput" clearable placeholder="请输入数据项甲" />
      </SvFormItem>
      <SvFormItem prop="bInput" label="数据项乙">
        <SvInput v-model="formData.bInput" clearable placeholder="请输入数据项乙" />
      </SvFormItem>
      <SvFormItem prop="cInput" label="数据项丙">
        <SvInput v-model="formData.cInput" clearable placeholder="请输入数据项丙" />
      </SvFormItem>
      <SvFormItem prop="dSelect" label="数据项丁">
        <SvDictSelect v-model="formData.dSelect" :dict-list="dict_d_select" label-key="label" value-key="value" placeholder="全部" />
      </SvFormItem>
      <SvFormItem prop="eSelect" label="数据项戊">
        <SvDictSelect v-model="formData.eSelect" :dict-list="dict_e_select" label-key="label" value-key="value" placeholder="全部" />
      </SvFormItem>
      <SvFormItem prop="fSelect" label="数据项己">
        <SvDictSelect v-model="formData.fSelect" :dict-list="dict_f_select" label-key="label" value-key="value" placeholder="全部" />
      </SvFormItem>
      <SvFormItem prop="gSelect" label="数据项庚">
        <SvDictSelect v-model="formData.gSelect" :dict-list="dict_g_select" label-key="label" value-key="value" placeholder="全部" />
      </SvFormItem>
      <SvFormItem prop="id" label="数据编号">
        <SvInput v-model="formData.id" clearable placeholder="请输入数据编号" />
      </SvFormItem>
      <SvFormItem prop="createdRange" label="创建日期">
        <SvDatePicker v-model="formData.createdRange" type="daterange" />
      </SvFormItem>
      <div class="filter-form-actions flex min-w-0 flex-wrap items-center justify-end gap-2 self-end">
        <Button type="button" @click="toConfirm"><i class="sv-icon-magnify" />查询</Button>
        <Button type="button" variant="outline" @click="reset"><i class="sv-icon-reload" />重置</Button>
        <Button class="filter-form-toggle" type="button" variant="ghost" @click="toggleExpanded">
          {{ expanded ? '收起条件' : '展开条件' }}
          <i :class="expanded ? 'sv-icon-chevronup' : 'sv-icon-chevrondown'" />
        </Button>
      </div>
    </SvForm>
  </section>
</template>

<script lang="ts" setup>
import { inject, ref, shallowRef, useTemplateRef } from 'vue'
import SvDatePicker from '@/components/SvDatePicker/SvDatePicker.vue'
import type { SvDatePickerValue } from '@/components/SvDatePicker/types'
import SvForm from '@/components/SvForm/SvForm.vue'
import SvFormItem from '@/components/SvForm/SvFormItem.vue'
import SvInput from '@/components/SvInput/SvInput.vue'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import { Button } from '@/components/ui/button'
import type { DemoQueryParams } from '@/types/demo'

const emit = defineEmits<{ search: [filters: Omit<DemoQueryParams, 'pageNum' | 'pageSize'>] }>()

/** 注入字典数据。 */
const { dict_d_select, dict_e_select, dict_f_select, dict_g_select } = inject<any>('__DICT__')

/** 适配日期组件的通用值类型，查询时仅提交完整范围或 null。 */
type FilterFormValues = Omit<DemoQueryParams, 'createdRange' | 'pageNum' | 'pageSize'> & {
  createdRange?: SvDatePickerValue
}

/** 默认筛选条件，pageNum 与 pageSize 由父组件管理。 */
const defaultQueryParams: Omit<DemoQueryParams, 'pageNum' | 'pageSize'> = {
  aInput: '',
  bInput: '',
  cInput: '',
  dSelect: '',
  eSelect: '',
  fSelect: '',
  gSelect: '',
  id: '',
  createdRange: null
}

/** 筛选条件表单数据。 */
const formData = ref<FilterFormValues>({ ...defaultQueryParams })
const filterFormRef = useTemplateRef('filterFormRef')
const expanded = shallowRef(false)

/** 标准化筛选文本，日期范围以双元素数组提交。 */
function submit({ createdRange, ...filters }: FilterFormValues) {
  const normalized = Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, value?.trim()])) as Omit<
    DemoQueryParams,
    'createdRange' | 'pageNum' | 'pageSize'
  >
  emit('search', {
    ...normalized,
    createdRange: Array.isArray(createdRange) ? createdRange : null
  })
}

/** 校验通过后提交当前筛选条件。 */
function toConfirm() {
  void filterFormRef.value?.validate((valid) => {
    if (valid) {
      submit({ ...formData.value })
    }
  })
}

/** 同时清除草稿与已经提交的筛选条件。 */
function reset() {
  filterFormRef.value?.resetFields()
  emit('search', { ...defaultQueryParams })
}

/** 切换筛选条件的显示行数。 */
function toggleExpanded() {
  expanded.value = !expanded.value
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

// $columns 控制每行的等宽列数，操作区也占一格；收起时最多显示两行，并为操作区预留末格。
@mixin filter-columns($columns) {
  // 从第 $columns * 2 个字段开始折叠；存在该字段时显示展开按钮。
  $overflow-start: $columns * 2;

  :deep(.filter-form-grid) {
    grid-template-columns: repeat($columns, minmax(0, 1fr));
  }

  .filter-form:not(.is-expanded) :deep(.filter-form-grid > [data-slot='field']:nth-child(n + #{$overflow-start})) {
    display: none;
  }

  .filter-form:has(.filter-form-grid > [data-slot='field']:nth-child(#{$overflow-start})) .filter-form-toggle {
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
