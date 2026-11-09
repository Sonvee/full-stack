<template>
  <Field
    :orientation="horizontal ? 'horizontal' : 'vertical'"
    :data-invalid="!!errors.length"
    :data-disabled="context.disabled.value || undefined"
    class="min-w-0 gap-2"
    @focusout="validateOnBlur"
  >
    <FieldLabel v-if="props.label" :for="inputId" :style="labelStyle">
      <span ref="labelContentRef" :class="{ 'shrink-0 whitespace-nowrap': horizontal }">
        <span v-if="required" class="text-destructive" aria-hidden="true">*</span
        >{{ props.label }}
      </span>
    </FieldLabel>
    <FieldContent class="min-w-0 gap-2" :class="{ 'w-0': horizontal }">
      <slot />
      <FieldDescription v-if="$slots.description"><slot name="description" /></FieldDescription>
      <FieldError v-if="errors.length" :id="errorId" :errors="errors" />
    </FieldContent>
  </Field>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, onScopeDispose, provide, useId, useTemplateRef, watch, type CSSProperties } from 'vue'
import { useElementSize } from '@vueuse/core'
import { cloneDeep } from 'es-toolkit'
import { get } from 'es-toolkit/compat'
import { useFormContext } from 'vee-validate'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { svFormFieldKey, svFormKey } from './context'
import { getFormRules } from './validation'

/**
 * prop 对应 SvForm.rules 的字段路径，必填标记默认从规则推导，也可通过 required 覆盖。
 *
 * @remarks
 * 内部的 SvInput、SvDictSelect、SvDatePicker 会自动接收 id、校验和禁用状态。
 * 值通过调用方 v-model 维护；失焦、change 以及表单提交时由 VeeValidate 校验。
 */
interface SvFormItemProps {
  prop: string
  label?: string
  for?: string
  required?: boolean
}
const props = withDefaults(defineProps<SvFormItemProps>(), { required: undefined })
const context = inject(svFormKey)
if (!context) {
  throw new Error('SvFormItem 必须位于 SvForm 内')
}
const { disabled, validationVersion, validateOn } = context
const horizontal = computed(() => context.labelPosition.value !== 'top')
const labelStyle = computed<CSSProperties>(() => {
  if (!horizontal.value) {
    return {}
  }
  return {
    width: context.labelWidth.value,
    flex: '0 0 auto',
    minHeight: '2.25rem',
    justifyContent: context.labelPosition.value === 'right' ? 'flex-end' : 'flex-start',
  }
})
const labelContentRef = useTemplateRef('labelContentRef')
const { width: labelContentWidth } = useElementSize(labelContentRef)
const labelKey = Symbol('label')
watch([labelContentWidth, horizontal], ([width, isHorizontal]) => {
  context.updateLabelWidth(labelKey, isHorizontal ? width : 0)
}, { immediate: true })
onScopeDispose(() => {
  context.removeLabelWidth(labelKey)
})
const { errorBag } = useFormContext<Record<string, unknown>>()
const errors = computed(() => errorBag.value[props.prop] || [])
const required = computed(() => props.required ?? getFormRules(context.rules.value[props.prop]).some((rule) => rule.required))
const generatedId = useId()
const inputId = computed(() => props.for || `sv-field-${generatedId}`)
const invalid = computed(() => errors.value.length > 0)
const errorId = computed(() => (invalid.value ? `${inputId.value}-error` : undefined))
provide(svFormFieldKey, {
  id: inputId.value,
  invalid,
  errorId,
  disabled: context.disabled,
})
// 观察实际绑定值，兼容 Select 等不冒泡原生 change 事件的控件；重置同轮跳过校验。
watch(
  () => [cloneDeep(get(context.model.value, props.prop)), validationVersion.value] as const,
  ([, version], [, previousVersion]) => {
    if (!disabled.value && version === previousVersion) {
      void validateOn(props.prop, 'change')
    }
  },
)

/** 在整个表单项失去焦点后校验，避免在项内按钮之间移动时重复触发。 */
async function validateOnBlur(event: FocusEvent) {
  if ((event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
    return
  }
  if (disabled.value) {
    return
  }
  const version = validationVersion.value
  await nextTick()
  if (version === validationVersion.value) {
    await validateOn(props.prop, 'blur')
  }
}
</script>

<style lang="scss" scoped></style>
