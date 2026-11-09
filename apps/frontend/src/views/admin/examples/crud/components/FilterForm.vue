<template>
  <section
    id="record-filters"
    class="filter-form flex min-h-0 max-h-[45%] shrink flex-col gap-3 rounded-lg border p-4"
    :class="{ 'is-expanded': expanded }"
    aria-labelledby="record-filters-title"
  >
    <h2 id="record-filters-title" class="shrink-0 text-sm font-medium">条件筛选</h2>
    <SvForm
      ref="filterForm"
      v-model:model="formData"
      class="flex min-h-0 flex-col gap-3"
      content-class="filter-form-grid grid min-h-0 overflow-y-auto gap-4 p-1"
      @submit="submit"
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
      <template #footer>
        <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button type="submit" size="sm"><i class="sv-icon-magnify" aria-hidden="true" data-icon="inline-start" />查询</Button>
          <Button type="button" variant="outline" size="sm" @click="reset">重置</Button>
          <Button type="button" variant="ghost" size="sm" :aria-expanded="expanded" @click="toggleExpanded"
            >{{ expanded ? '收起条件' : '展开条件'
            }}<i :class="expanded ? 'sv-icon-chevronup' : 'sv-icon-chevrondown'" aria-hidden="true" data-icon="inline-end"
          /></Button>
        </div>
      </template>
    </SvForm>
  </section>
</template>

<script lang="ts" setup>
import { inject, ref, shallowRef, useTemplateRef } from 'vue'
import SvDatePicker from '@/components/SvDatePicker/SvDatePicker.vue'
import type { SvDatePickerValue } from '@/components/SvDatePicker/types'
import SvForm from '@/components/SvForm/SvForm.vue'
import type { SvFormInstance } from '@/components/SvForm/types'
import SvFormItem from '@/components/SvForm/SvFormItem.vue'
import SvInput from '@/components/SvInput/SvInput.vue'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import { Button } from '@/components/ui/button'
import type { DemoDictData, DemoFilterValues } from '@/types/demo'

const emit = defineEmits<{ search: [filters: DemoFilterValues] }>()
const { dict_d_select, dict_e_select, dict_f_select, dict_g_select } = inject<DemoDictData>('__DICT__')!
/** 适配日期组件的通用值类型，查询时仅提交完整范围或 null。 */
type FilterFormValues = Omit<DemoFilterValues, 'createdRange'> & {
  createdRange: SvDatePickerValue
}
const defaultDemoFilterValues: DemoFilterValues = {
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
const formData = ref<FilterFormValues>({ ...defaultDemoFilterValues })
const expanded = shallowRef(false)
const filterForm = useTemplateRef<SvFormInstance>('filterForm')
/** 标准化筛选文本，日期范围以双元素数组提交。 */
function submit({ createdRange, ...filters }: FilterFormValues) {
  const normalized = Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, value.trim()])) as Omit<
    DemoFilterValues,
    'createdRange'
  >
  emit('search', {
    ...normalized,
    createdRange: Array.isArray(createdRange) ? createdRange : null
  })
}

/** 同时清除草稿与已经提交的筛选条件。 */
function reset() {
  filterForm.value?.resetFields()
  emit('search', { ...defaultDemoFilterValues })
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

:deep(.filter-form-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}

.filter-form:not(.is-expanded) :deep(.filter-form-grid > :nth-child(n + 3)) {
  display: none;
}

@container filter-form (min-width: 29rem) {
  .filter-form:not(.is-expanded) :deep(.filter-form-grid > :nth-child(n + 5)) {
    display: none;
  }
}

@container filter-form (min-width: 44rem) {
  .filter-form:not(.is-expanded) :deep(.filter-form-grid > :nth-child(n + 7)) {
    display: none;
  }
}

@container filter-form (min-width: 59rem) {
  .filter-form:not(.is-expanded) :deep(.filter-form-grid > :nth-child(n + 9)) {
    display: none;
  }
}
</style>
