<template>
  <Dialog :open="true" @update:open="handleOpenChange">
    <DialogContent class="flex max-h-[85svh] flex-col sm:max-w-xl">
      <DialogHeader class="shrink-0"
        ><DialogTitle>{{ record ? '编辑数据' : '新增数据' }}</DialogTitle
        ><DialogDescription>请填写各数据项，所有字段均为必填项。</DialogDescription></DialogHeader
      >
      <SvForm
        v-model:model="draft"
        :rules="rules"
        class="flex min-h-0 flex-col gap-4"
        content-class="grid min-h-0 overflow-y-auto gap-4 p-1 sm:grid-cols-2"
        @submit="submit"
      >
        <SvFormItem
          v-for="field in fields"
          :key="field.name"
          v-slot="{ id, invalid, errorId, disabled }"
          :prop="field.name"
          :label="field.label"
          required
        >
          <Select v-if="field.options" v-model="draft[field.name]" :disabled="disabled">
            <SelectTrigger
              :id="id"
              class="w-full"
              :aria-invalid="invalid"
              :aria-describedby="errorId"
              ><SelectValue placeholder="请选择"
            /></SelectTrigger>
            <SelectContent
              ><SelectGroup
                ><SelectItem v-for="option in field.options" :key="option" :value="option">{{
                  option
                }}</SelectItem></SelectGroup
              ></SelectContent
            >
          </Select>
          <SvInput
            v-else
            :id="id"
            v-model="draft[field.name]"
            clearable
            :placeholder="`请输入${field.label}`"
            :disabled="disabled"
            :aria-invalid="invalid"
            :aria-describedby="errorId"
            :maxlength="100"
          />
        </SvFormItem>
        <template #footer="{ isSubmitting }">
          <DialogFooter class="shrink-0"
            ><Button type="button" variant="outline" @click="emit('close')">取消</Button
            ><Button type="submit" :disabled="isSubmitting">保存</Button></DialogFooter
          >
        </template>
      </SvForm>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SvForm from '@/components/SvForm/SvForm.vue'
import type { SvFormRules } from '@/components/SvForm/types'
import SvFormItem from '@/components/SvForm/SvFormItem.vue'
import SvInput from '@/components/SvInput/SvInput.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

const { record } = defineProps<{ record: DataRecord | null }>()
const emit = defineEmits<{ save: [values: FormValues]; close: [] }>()
const draft = ref<FormValues>(
  record
    ? (Object.fromEntries(fields.map((field) => [field.name, record[field.name]])) as FormValues)
    : { ...defaultFormValues },
)
/** 复用模板字段规则；SvForm 直接使用 VeeValidate 的函数校验契约。 */
const rules: SvFormRules = Object.fromEntries(
  fields.map((field) => [field.name, (value: unknown) => validateFieldValue(value, field)]),
)

/** 保存前统一去除首尾空白，字段合法性由 SvForm 校验。 */
function submit(values: FormValues) {
  emit(
    'save',
    Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    ) as FormValues,
  )
}
/** 关闭按钮、Escape 与取消操作统一通知页面。 */
function handleOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<style lang="scss" scoped></style>
