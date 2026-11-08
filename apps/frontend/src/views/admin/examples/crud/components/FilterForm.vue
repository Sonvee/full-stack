<template>
  <section
    id="record-filters"
    class="flex min-h-0 max-h-[45%] shrink flex-col gap-3 rounded-lg border p-4"
    aria-labelledby="record-filters-title"
  >
    <h2 id="record-filters-title" class="shrink-0 text-sm font-medium">条件筛选</h2>
    <form ref="filterForm" class="flex min-h-0 flex-col gap-3" novalidate @submit="submit">
      <div id="record-filter-fields" class="min-h-0 overflow-y-auto p-1">
        <FieldGroup
          class="grid gap-4"
          :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
        >
          <VeeField
            v-for="field in visibleFields"
            :key="field.name"
            v-slot="{ componentField, errors }"
            :name="field.name"
            :rules="field.name === 'createdTo' ? validateEndDate : undefined"
          >
            <Field class="min-w-0 gap-2" :data-invalid="!!errors.length">
              <FieldLabel :for="`filter-${field.name}`">{{ field.label }}</FieldLabel>
              <Select v-if="field.options" v-bind="componentField">
                <SelectTrigger :id="`filter-${field.name}`" class="w-full">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__all__">全部</SelectItem>
                    <SelectItem v-for="option in field.options" :key="option" :value="option">
                      {{ option }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                v-else
                :id="`filter-${field.name}`"
                v-bind="componentField"
                :type="field.type"
                :placeholder="field.type === 'date' ? undefined : `请输入${field.label}`"
                :min="field.name === 'createdTo' ? values.createdFrom || undefined : undefined"
                :aria-invalid="!!errors.length"
                :aria-describedby="errors.length ? `filter-error-${field.name}` : undefined"
              />
              <FieldError
                v-if="errors.length"
                :id="`filter-error-${field.name}`"
                :errors="errors"
              />
            </Field>
          </VeeField>
        </FieldGroup>
      </div>
      <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <Button type="submit" size="sm">
          <i class="sv-icon-magnify" aria-hidden="true" data-icon="inline-start" />查询
        </Button>
        <Button type="button" variant="outline" size="sm" @click="reset">重置</Button>
        <Button
          v-if="fields.length > collapsedCount"
          type="button"
          variant="ghost"
          size="sm"
          :aria-expanded="expanded"
          aria-controls="record-filter-fields"
          @click="expanded = !expanded"
        >
          {{ expanded ? '收起条件' : '展开条件' }}
          <i
            :class="cn(expanded ? 'sv-icon-chevronup' : 'sv-icon-chevrondown')"
            aria-hidden="true"
            data-icon="inline-end"
          />
        </Button>
      </div>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { computed, shallowRef, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import { Field as VeeField, useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
const expanded = shallowRef(false)
const filterForm = useTemplateRef<HTMLFormElement>('filterForm')
const { width } = useElementSize(filterForm)
const columns = computed(() => Math.max(1, Math.min(4, Math.floor((width.value + 16) / 240))))
const collapsedCount = computed(() => columns.value * 2)
const fields = [
  ...dataFields.map((field) => ({ ...field, type: 'text' })),
  { name: 'id', label: '数据编号', type: 'text', options: undefined },
  { name: 'createdFrom', label: '创建日期起', type: 'date', options: undefined },
  { name: 'createdTo', label: '创建日期止', type: 'date', options: undefined },
] satisfies {
  name: keyof FilterValues
  label: string
  type: string
  options?: readonly string[]
}[]
const visibleFields = computed(() =>
  expanded.value ? fields : fields.slice(0, collapsedCount.value),
)
const { handleSubmit, resetForm, values } = useForm<FilterValues>({
  initialValues: { ...defaultFilterValues },
  keepValuesOnUnmount: true,
})

const submit = handleSubmit((filters) => {
  const normalized = Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value === '__all__' ? '' : value.trim()]),
  ) as unknown as FilterValues
  emit('search', normalized)
})

function reset() {
  resetForm({ values: { ...defaultFilterValues } })
  emit('search', { ...defaultFilterValues })
}

function validateEndDate(value: unknown): true | string {
  if (typeof value === 'string' && value && values.createdFrom && value < values.createdFrom) {
    return '结束日期不能早于开始日期'
  }
  return true
}
</script>

<style lang="scss" scoped></style>
