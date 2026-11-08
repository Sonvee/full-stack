<template>
  <Field
    :data-invalid="!!errors.length"
    :data-disabled="context.disabled.value || undefined"
    class="min-w-0 gap-2"
    @focusout="validateOnBlur"
    @change="validateOnChange"
  >
    <FieldLabel v-if="props.label" :for="inputId">
      <span v-if="props.required" class="text-destructive" aria-hidden="true">*</span
      >{{ props.label }}
    </FieldLabel>
    <slot
      :id="inputId"
      :invalid="!!errors.length"
      :error="errorMessage"
      :disabled="context.disabled.value"
      :error-id="errors.length ? errorId : undefined"
    />
    <FieldDescription v-if="$slots.description"><slot name="description" /></FieldDescription>
    <FieldError v-if="errors.length" :id="errorId" :errors="errors" />
  </Field>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, useId } from 'vue'
import { useField } from 'vee-validate'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { svFormKey } from './context'

/**
 * prop 对应 SvForm.rules 的字段路径，label 关联控件 id，required 仅展示必填标记。
 *
 * @remarks
 * 控件应使用插槽提供的 id、invalid、errorId、disabled 绑定无障碍和禁用属性。
 * 值通过调用方 v-model 维护；失焦、change 以及表单提交时由 VeeValidate 校验。
 */
interface SvFormItemProps {
  prop: string
  label?: string
  for?: string
  required?: boolean
}
const props = defineProps<SvFormItemProps>()
const context = inject(svFormKey)
if (!context) throw new Error('SvFormItem 必须位于 SvForm 内')
const generatedId = useId()
const inputId = computed(() => props.for || `sv-field-${generatedId}`)
const errorId = computed(() => `${inputId.value}-error`)
const { errors, errorMessage, validate, setTouched } = useField(() => props.prop, undefined, {
  keepValueOnUnmount: true,
  validateOnValueUpdate: false,
})

/** 在整个表单项失去焦点后标记已访问并校验，避免在项内按钮之间移动时重复触发。 */
async function validateOnBlur(event: FocusEvent) {
  if ((event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) return
  if (context!.disabled.value) return
  setTouched(true)
  await nextTick()
  await validate()
}

/** 等待控件 v-model 同步后校验选择或清空产生的 change。 */
async function validateOnChange() {
  if (context!.disabled.value) return
  await nextTick()
  await validate()
}
</script>

<style lang="scss" scoped></style>
