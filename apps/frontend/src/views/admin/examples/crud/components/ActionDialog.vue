<template>
  <Dialog v-model:open="open">
    <DialogContent class="flex max-h-[85svh] flex-col sm:max-w-xl">
      <DialogHeader class="shrink-0">
        <DialogTitle>{{ item ? '编辑数据' : '新增数据' }}</DialogTitle>
        <DialogDescription>请填写各数据项，所有字段均为必填项。</DialogDescription>
      </DialogHeader>
      <SvForm
        v-model:model="draft"
        :rules="rules"
        class="flex min-h-0 min-w-0 flex-col gap-4"
        content-class="grid min-h-0 min-w-0 overflow-x-hidden overflow-y-auto gap-4 p-1 sm:grid-cols-2"
        @submit="submit"
      >
        <SvFormItem
          v-for="field in demoFields"
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
            >
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="option in field.options" :key="option" :value="option">
                  {{ option }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
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
          <DialogFooter class="shrink-0">
            <DialogClose as-child>
              <Button type="button" variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" :disabled="isSubmitting">保存</Button>
          </DialogFooter>
        </template>
      </SvForm>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import SvForm from '@/components/SvForm/SvForm.vue'
import type { SvFormRules } from '@/components/SvForm/types'
import SvFormItem from '@/components/SvForm/SvFormItem.vue'
import SvInput from '@/components/SvInput/SvInput.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
  defaultDemoFormValues,
  demoFields,
  validateDemoFieldValue,
  type DemoFormValues,
  type DemoListItem,
} from '@/api/demo'

const { item } = defineProps<{ item: DemoListItem | null }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ save: [values: DemoFormValues] }>()
const draft = ref<DemoFormValues>({ ...defaultDemoFormValues })
/** 复用模板字段规则；SvForm 直接使用 VeeValidate 的函数校验契约。 */
const rules: SvFormRules = Object.fromEntries(
  demoFields.map((field) => [field.name, (value: unknown) => validateDemoFieldValue(value, field)]),
)

// 组件保持挂载，每次打开都重新创建草稿，避免沿用上次编辑或取消的内容。
watch(
  open,
  (isOpen) => {
    if (!isOpen) {
      return
    }
    draft.value = item
      ? (Object.fromEntries(
          demoFields.map((field) => [field.name, item[field.name]]),
        ) as DemoFormValues)
      : { ...defaultDemoFormValues }
  },
)

/** 保存前统一去除首尾空白，字段合法性由 SvForm 校验。 */
function submit(values: DemoFormValues) {
  emit(
    'save',
    Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    ) as DemoFormValues,
  )
}
</script>

<style lang="scss" scoped></style>
