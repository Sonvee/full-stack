<template>
  <Dialog :open="true" @update:open="handleOpenChange">
    <DialogContent class="flex max-h-[85svh] flex-col sm:max-w-xl">
      <DialogHeader class="shrink-0">
        <DialogTitle>{{ record ? '编辑数据' : '新增数据' }}</DialogTitle>
        <DialogDescription>请填写各数据项，所有字段均为必填项。</DialogDescription>
      </DialogHeader>
      <form id="action-form" class="min-h-0 overflow-y-auto p-1" novalidate @submit="submit">
        <FieldGroup class="grid gap-4 sm:grid-cols-2">
          <VeeField
            v-for="field in fields"
            :key="field.name"
            v-slot="{ componentField, errors }"
            :name="field.name"
            :rules="(value: unknown) => validateFieldValue(value, field)"
          >
            <Field class="min-w-0 gap-2" :data-invalid="!!errors.length">
              <FieldLabel :for="`action-${field.name}`">{{ field.label }}</FieldLabel>
              <Select v-if="field.options" v-bind="componentField">
                <SelectTrigger
                  :id="`action-${field.name}`"
                  class="w-full"
                  :aria-invalid="!!errors.length"
                  :aria-describedby="errors.length ? `error-${field.name}` : undefined"
                >
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="option in field.options" :key="option" :value="option">{{
                      option
                    }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                v-else
                :id="`action-${field.name}`"
                v-bind="componentField"
                :placeholder="`请输入${field.label}`"
                :aria-invalid="!!errors.length"
                :aria-describedby="errors.length ? `error-${field.name}` : undefined"
                :maxlength="100"
              />
              <FieldError v-if="errors.length" :id="`error-${field.name}`" :errors="errors" />
            </Field>
          </VeeField>
        </FieldGroup>
      </form>
      <DialogFooter class="shrink-0">
        <Button type="button" variant="outline" @click="emit('close')">取消</Button>
        <Button type="submit" form="action-form" :disabled="isSubmitting">保存</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Field as VeeField, useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  defaultFormValues,
  fields,
  validateFieldValue,
  type DataRecord,
  type FormValues,
} from '../data-model'

const { record } = defineProps<{
  record: DataRecord | null
}>()
const emit = defineEmits<{ save: [values: FormValues]; close: [] }>()
const { handleSubmit, isSubmitting } = useForm<FormValues>({
  initialValues: record
    ? (Object.fromEntries(fields.map((field) => [field.name, record[field.name]])) as FormValues)
    : { ...defaultFormValues },
})
const submit = handleSubmit((draft) => {
  emit(
    'save',
    Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, value.trim()]),
    ) as FormValues,
  )
})

function handleOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<style lang="scss" scoped></style>
