<template>
  <form v-bind="$attrs" novalidate @submit.prevent="submit">
    <FieldGroup :class="props.contentClass">
      <slot :is-submitting="isSubmitting" />
    </FieldGroup>
    <slot name="footer" :is-submitting="isSubmitting" />
  </form>
</template>

<script lang="ts" setup generic="T extends Record<string, unknown>">
import { computed, provide, watch, type HTMLAttributes } from 'vue'
import { cloneDeep } from 'es-toolkit'
import { useForm } from 'vee-validate'
import { FieldGroup } from '@/components/ui/field'
import { svFormKey } from './context'
import type { SvFormInstance, SvFormRules } from './types'
import { useFormValidation } from './use-form-validation'

defineOptions({ inheritAttrs: false })

/**
 * model 由调用方维护，表单校验复用 VeeValidate，字段通过 prop 声明校验路径。
 *
 * @remarks
 * 使用 v-model:model 可接收 resetFields 的初始快照；字段控件仍直接绑定 model 属性。
 * contentClass 控制字段布局，其他属性透传 form。
 */
interface SvFormProps {
  rules?: SvFormRules<T>
  disabled?: boolean
  contentClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SvFormProps>(), { disabled: false })
const model = defineModel<T>('model', { required: true })
const emit = defineEmits<{
  submit: [values: T]
  invalid: [errors: Record<string, string | undefined>]
}>()
const initialValues = cloneDeep(model.value)
const form = useForm<Record<string, unknown>>({
  initialValues: cloneDeep(initialValues),
  keepValuesOnUnmount: true,
})
const rules = computed<SvFormRules>(() => props.rules || {})
const { validate, validateField, validateOn, clearValidate, validationVersion, isValidating: isSubmitting } =
  useFormValidation(model, rules, form)
provide(svFormKey, { disabled: computed(() => props.disabled), model, rules, validationVersion, validateOn })

// 控件通过 v-model 修改外部 model 后，同步到校验状态；不修改调用方的字段对象。
watch(model, (value) => form.setValues(cloneDeep(value), false), { deep: true, flush: 'sync' })

/** 保留原生提交契约，供筛选表单与回车提交使用。 */
async function submit() {
  if (props.disabled || isSubmitting.value) {
    return
  }
  if (await validate()) {
    emit('submit', cloneDeep(model.value))
  } else {
    emit('invalid', form.errors.value)
  }
}

/** 恢复组件创建时的初始快照，并清除校验与 touched 状态。 */
function resetFields() {
  clearValidate()
  model.value = cloneDeep(initialValues)
  form.resetForm({ values: cloneDeep(initialValues) }, { force: true })
}

defineExpose<SvFormInstance>({ validate, validateField, resetFields, clearValidate })
</script>

<style lang="scss" scoped></style>
