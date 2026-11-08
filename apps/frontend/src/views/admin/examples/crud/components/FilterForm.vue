<template>
  <section
    id="record-filters"
    ref="filterSection"
    class="flex min-h-0 max-h-[45%] shrink flex-col gap-3 rounded-lg border p-4"
    aria-labelledby="record-filters-title"
  >
    <h2 id="record-filters-title" class="shrink-0 text-sm font-medium">条件筛选</h2>
    <SvForm
      ref="filterForm"
      v-model:model="draft"
      :columns="columns"
      class="flex min-h-0 flex-col gap-3"
      content-class="min-h-0 overflow-y-auto gap-4 p-1"
      @submit="submit"
      @invalid="expanded = true"
    >
      <SvFormItem
        v-for="field in visibleFields"
        :key="field.name"
        v-slot="{ id, invalid, errorId, disabled }"
        :prop="field.name"
        :label="field.label"
        :class="cn(field.type === 'date-range' && columns > 1 && 'col-span-2')"
      >
        <Select v-if="field.options" v-model="draft[field.name]" :disabled="disabled">
          <SelectTrigger :id="id" class="w-full" :aria-invalid="invalid" :aria-describedby="errorId"
            ><SelectValue placeholder="全部"
          /></SelectTrigger>
          <SelectContent
            ><SelectGroup
              ><SelectItem value="__all__">全部</SelectItem
              ><SelectItem v-for="option in field.options" :key="option" :value="option">{{
                option
              }}</SelectItem></SelectGroup
            ></SelectContent
          >
        </Select>
        <SvDatePicker
          v-else-if="field.type === 'date-range'"
          :id="id"
          v-model="draft.createdRange"
          type="daterange"
          :disabled="disabled"
          :aria-invalid="invalid"
          :aria-describedby="errorId"
        />
        <SvInput
          v-else-if="field.type === 'text'"
          :id="id"
          v-model="draft[field.name]"
          clearable
          :placeholder="`请输入${field.label}`"
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
            v-if="fields.length > collapsedCount"
            type="button"
            variant="ghost"
            size="sm"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
            >{{ expanded ? '收起条件' : '展开条件'
            }}<i
              :class="cn(expanded ? 'sv-icon-chevronup' : 'sv-icon-chevrondown')"
              aria-hidden="true"
              data-icon="inline-end"
          /></Button>
        </div>
      </template>
    </SvForm>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
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
import { cn } from '@/lib/utils'
import { defaultFilterValues, fields as dataFields, type FilterValues } from '../data-model'

const emit = defineEmits<{ search: [filters: FilterValues] }>()
/** 日期组件仅提交完整范围，空值在查询时映射为空字符串边界。 */
type FilterFormValues = Omit<FilterValues, 'createdFrom' | 'createdTo'> & {
  createdRange: SvDatePickerValue
}
const { createdFrom, createdTo, ...textDefaults } = defaultFilterValues
const draft = ref<FilterFormValues>({
  ...textDefaults,
  createdRange: createdFrom && createdTo ? [createdFrom, createdTo] : null,
})
const expanded = shallowRef(false)
const filterSection = useTemplateRef<HTMLElement>('filterSection')
const filterForm = useTemplateRef<SvFormInstance>('filterForm')
const { width } = useElementSize(filterSection)
const columns = computed(() => Math.max(1, Math.min(4, Math.floor((width.value + 16) / 240))))
const collapsedCount = computed(() => columns.value * 2)
const fields = [
  ...dataFields.map((field) => ({ ...field, type: 'text' as const })),
  { name: 'id', label: '数据编号', type: 'text', options: undefined },
  { name: 'createdRange', label: '创建日期', type: 'date-range', options: undefined },
] satisfies Array<
  | { name: keyof typeof textDefaults; label: string; type: 'text'; options?: readonly string[] }
  | { name: 'createdRange'; label: string; type: 'date-range'; options?: undefined }
>
const visibleFields = computed(() =>
  expanded.value ? fields : fields.slice(0, collapsedCount.value),
)

/** 标准化文本和“全部”选项，并展开日期范围供列表筛选。 */
function submit({ createdRange, ...filters }: FilterFormValues) {
  const normalized = Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value === '__all__' ? '' : value.trim()]),
  ) as Omit<FilterValues, 'createdFrom' | 'createdTo'>
  emit('search', {
    ...normalized,
    createdFrom: Array.isArray(createdRange) ? createdRange[0] : '',
    createdTo: Array.isArray(createdRange) ? createdRange[1] : '',
  })
}

/** 同时清除草稿与已经提交的筛选条件。 */
function reset() {
  filterForm.value?.resetFields()
  emit('search', { ...defaultFilterValues })
}
</script>

<style lang="scss" scoped></style>
