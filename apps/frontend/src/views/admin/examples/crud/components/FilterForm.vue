<template>
  <section
    id="record-filters"
    class="filter-form flex min-h-0 min-w-0 max-h-[70%] shrink flex-col gap-3 rounded-lg border p-4"
    :class="{ 'is-expanded': expanded }"
  >
    <SvForm
      ref="filterFormRef"
      v-model:model="formData"
      label-width="auto"
      label-position="right"
      class="flex min-h-0 min-w-0 flex-col gap-3"
      content-class="filter-form-grid grid min-h-0 min-w-0 overflow-x-hidden overflow-y-auto gap-4 p-1"
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
        <Button type="button" @click="toConfirm"><i class="sv-icon-magnify" data-icon="inline-start" />查询</Button>
        <Button type="button" variant="outline" @click="reset">重置</Button>
        <Button class="filter-form-toggle" type="button" variant="ghost" :aria-expanded="expanded" @click="toggleExpanded">
          {{ expanded ? '收起条件' : '展开条件' }}
          <i :class="expanded ? 'sv-icon-chevronup' : 'sv-icon-chevrondown'" data-icon="inline-end" />
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
const { dict_d_select, dict_e_select, dict_f_select, dict_g_select } = inject<any>('__DICT__')
/** 适配日期组件的通用值类型，查询时仅提交完整范围或 null。 */
type FilterFormValues = Omit<DemoQueryParams, 'createdRange' | 'pageNum' | 'pageSize'> & {
  createdRange?: SvDatePickerValue
}
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
const formData = ref<FilterFormValues>({ ...defaultQueryParams })
const expanded = shallowRef(false)
const filterFormRef = useTemplateRef('filterFormRef')
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

// 收起时为操作区预留末格，只折叠字段；按钮显隐也按这一容量判断。
@mixin filter-columns($columns) {
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

@include filter-columns(4);

@container filter-form (width < 29rem) {
  @include filter-columns(1);
}

@container filter-form (29rem <= width < 44rem) {
  @include filter-columns(2);
}

@container filter-form (44rem <= width < 59rem) {
  @include filter-columns(3);
}
</style>
