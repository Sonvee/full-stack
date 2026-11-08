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
      v-model:model="draft"
      class="flex min-h-0 flex-col gap-3"
      content-class="filter-form-grid grid min-h-0 overflow-y-auto gap-4 p-1"
      @submit="submit"
    >
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="a-input"
        label="数据项甲"
      >
        <SvInput
          :id="id"
          v-model="draft['a-input']"
          clearable
          placeholder="请输入数据项甲"
          :disabled="disabled"
          :aria-invalid="invalid"
          :aria-describedby="errorId"
        />
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="b-input"
        label="数据项乙"
      >
        <SvInput
          :id="id"
          v-model="draft['b-input']"
          clearable
          placeholder="请输入数据项乙"
          :disabled="disabled"
          :aria-invalid="invalid"
          :aria-describedby="errorId"
        />
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="c-input"
        label="数据项丙"
      >
        <SvInput
          :id="id"
          v-model="draft['c-input']"
          clearable
          placeholder="请输入数据项丙"
          :disabled="disabled"
          :aria-invalid="invalid"
          :aria-describedby="errorId"
        />
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="d-select"
        label="数据项丁"
      >
        <Select v-model="draft['d-select']" :disabled="disabled">
          <SelectTrigger :id="id" class="w-full" :aria-invalid="invalid" :aria-describedby="errorId">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__all__">全部</SelectItem>
              <SelectItem v-for="option in dSelectOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="e-select"
        label="数据项戊"
      >
        <Select v-model="draft['e-select']" :disabled="disabled">
          <SelectTrigger :id="id" class="w-full" :aria-invalid="invalid" :aria-describedby="errorId">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__all__">全部</SelectItem>
              <SelectItem v-for="option in eSelectOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="f-select"
        label="数据项己"
      >
        <Select v-model="draft['f-select']" :disabled="disabled">
          <SelectTrigger :id="id" class="w-full" :aria-invalid="invalid" :aria-describedby="errorId">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__all__">全部</SelectItem>
              <SelectItem v-for="option in fSelectOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="g-select"
        label="数据项庚"
      >
        <Select v-model="draft['g-select']" :disabled="disabled">
          <SelectTrigger :id="id" class="w-full" :aria-invalid="invalid" :aria-describedby="errorId">
            <SelectValue placeholder="全部" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__all__">全部</SelectItem>
              <SelectItem v-for="option in gSelectOptions" :key="option" :value="option">
                {{ option }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="id"
        label="数据编号"
      >
        <SvInput
          :id="id"
          v-model="draft.id"
          clearable
          placeholder="请输入数据编号"
          :disabled="disabled"
          :aria-invalid="invalid"
          :aria-describedby="errorId"
        />
      </SvFormItem>
      <SvFormItem
        v-slot="{ id, invalid, errorId, disabled }"
        prop="createdRange"
        label="创建日期"
      >
        <SvDatePicker
          :id="id"
          v-model="draft.createdRange"
          type="daterange"
          :disabled="disabled"
          :aria-invalid="invalid"
          :aria-describedby="errorId"
        />
      </SvFormItem>
      <template #footer>
        <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button type="submit" size="sm"
            ><i class="sv-icon-magnify" aria-hidden="true" data-icon="inline-start" />查询</Button
          >
          <Button type="button" variant="outline" size="sm" @click="reset">重置</Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            :aria-expanded="expanded"
            @click="toggleExpanded"
            >{{ expanded ? '收起条件' : '展开条件'
            }}<i
              :class="expanded ? 'sv-icon-chevronup' : 'sv-icon-chevrondown'"
              aria-hidden="true"
              data-icon="inline-end"
          /></Button>
        </div>
      </template>
    </SvForm>
  </section>
</template>

<script lang="ts" setup>
import { ref, shallowRef, useTemplateRef } from 'vue'
import SvDatePicker from '@/components/SvDatePicker/SvDatePicker.vue'
import type { SvDatePickerValue } from '@/components/SvDatePicker/types'
import SvForm from '@/components/SvForm/SvForm.vue'
import type { SvFormInstance } from '@/components/SvForm/types'
import SvFormItem from '@/components/SvForm/SvFormItem.vue'
import SvInput from '@/components/SvInput/SvInput.vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  defaultDemoFilterValues,
  demoFields,
  type DemoFilterValues,
} from '@/api/demo'

const emit = defineEmits<{ search: [filters: DemoFilterValues] }>()
/** 日期组件仅提交完整范围，空值在查询时映射为空字符串边界。 */
type FilterFormValues = Omit<DemoFilterValues, 'createdFrom' | 'createdTo'> & {
  createdRange: SvDatePickerValue
}
const { createdFrom, createdTo, ...textDefaults } = defaultDemoFilterValues
const dSelectOptions = demoFields[3]?.options ?? []
const eSelectOptions = demoFields[4]?.options ?? []
const fSelectOptions = demoFields[5]?.options ?? []
const gSelectOptions = demoFields[6]?.options ?? []
const draft = ref<FilterFormValues>({
  ...textDefaults,
  createdRange: createdFrom && createdTo ? [createdFrom, createdTo] : null,
})
const expanded = shallowRef(false)
const filterForm = useTemplateRef<SvFormInstance>('filterForm')
/** 标准化文本和“全部”选项，并展开日期范围供列表筛选。 */
function submit({ createdRange, ...filters }: FilterFormValues) {
  const normalized = Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value === '__all__' ? '' : value.trim()]),
  ) as Omit<DemoFilterValues, 'createdFrom' | 'createdTo'>
  emit('search', {
    ...normalized,
    createdFrom: Array.isArray(createdRange) ? createdRange[0] : '',
    createdTo: Array.isArray(createdRange) ? createdRange[1] : '',
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
