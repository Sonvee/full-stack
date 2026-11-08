<template>
  <form v-bind="$attrs" novalidate @submit="submit">
    <FieldGroup
      :class="cn(props.columns && 'grid', props.contentClass)"
      :style="
        props.columns
          ? { gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` }
          : undefined
      "
    >
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
import { cn } from '@/lib/utils'
import { svFormKey } from './context'
import type { SvFormInstance, SvFormRules } from './types'

defineOptions({ inheritAttrs: false })

/**
 * model 由调用方维护，表单校验复用 VeeValidate，字段通过 prop 声明校验路径。
 *
 * @remarks
 * 使用 v-model:model 可接收 resetFields 的初始快照；字段控件仍直接绑定 model 属性。
 * columns 控制 FieldGroup 列数，contentClass 仅影响字段布局，其他属性透传 form。
 */
interface SvFormProps {
  rules?: SvFormRules
  disabled?: boolean
  columns?: number
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
  validationSchema: computed(() => props.rules || {}),
  keepValuesOnUnmount: true,
})
const { isSubmitting } = form
provide(svFormKey, { disabled: computed(() => props.disabled) })

// 控件通过 v-model 修改外部 model 后，同步到校验状态；不修改调用方的字段对象。
watch(model, (value) => form.setValues(cloneDeep(value), false), { deep: true, flush: 'sync' })

/** 校验整个表单；即使字段被折叠卸载，其 schema 规则仍会执行。 */
const submit = form.handleSubmit(
  (values) => {
    if (!props.disabled) emit('submit', values as T)
  },
  ({ errors }) => emit('invalid', errors),
)

/** 执行全部规则并返回是否通过，不触发 submit 事件。 */
async function validate(): Promise<boolean> {
  return (await form.validate()).valid
}

/**
 * 校验单个字段。
 * @param prop - 与 SvFormItem.prop 一致的字段路径。
 * @returns 字段是否通过校验。
 */
async function validateField(prop: string): Promise<boolean> {
  return (await form.validateField(prop)).valid
}

/** 恢复组件创建时的初始快照，并清除校验与 touched 状态。 */
function resetFields() {
  model.value = cloneDeep(initialValues)
  form.resetForm({ values: cloneDeep(initialValues) })
}

/** 清除当前错误信息，保留字段值。 */
function clearValidate() {
  for (const prop of Object.keys(form.errors.value)) form.setFieldError(prop, undefined)
}

defineExpose<SvFormInstance>({ validate, validateField, resetFields, clearValidate })
</script>

<style lang="scss" scoped></style>
