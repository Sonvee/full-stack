<template>
  <form v-bind="$attrs" novalidate @submit.prevent="submit">
    <FieldGroup :class="props.contentClass">
      <slot />
    </FieldGroup>
    <slot name="footer" />
  </form>
</template>

<script lang="ts" setup>
import { computed, provide, shallowReactive, watch, type HTMLAttributes } from 'vue'
import { cloneDeep } from 'es-toolkit'
import { useForm } from 'vee-validate'
import { FieldGroup } from '@/components/ui/field'
import { svFormKey } from './context'
import type { SvFormInstance, SvFormLabelPosition, SvFormRules } from './types'
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
  rules?: SvFormRules
  disabled?: boolean
  /** 标签默认位于上方；left/right 将标签放在控件左侧并指定对齐方向。 */
  labelPosition?: SvFormLabelPosition
  /** auto 统一采用可见标签的最大宽度；数字和数字字符串按 px 处理，也支持 CSS 长度。 */
  labelWidth?: string | number
  contentClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SvFormProps>(), { disabled: false, labelPosition: 'top', labelWidth: 'auto' })
const model = defineModel<any>('model', { required: true })
const emit = defineEmits<{
  submit: [values: any]
  invalid: [errors: Record<string, string | undefined>]
}>()
const initialValues = cloneDeep(model.value)
const form = useForm<Record<string, unknown>>({
  initialValues: cloneDeep(initialValues),
  keepValuesOnUnmount: true,
})
const rules = computed<SvFormRules>(() => props.rules || {})
const { validate, validateField, validateOn, clearValidate, validationVersion, isValidating } =
  useFormValidation(model, rules, form)
const labelWidths = shallowReactive(new Map<symbol, number>())
const labelWidth = computed(() => {
  if (props.labelWidth === 'auto') {
    const width = Math.ceil(Math.max(0, ...labelWidths.values()))
    return width > 0 ? `${width}px` : 'auto'
  }
  if (typeof props.labelWidth === 'number' || /^\d+(?:\.\d+)?$/.test(props.labelWidth)) {
    return `${props.labelWidth}px`
  }
  return props.labelWidth
})

function updateLabelWidth(key: symbol, width: number) {
  labelWidths.set(key, width)
}

function removeLabelWidth(key: symbol) {
  labelWidths.delete(key)
}

provide(svFormKey, {
  disabled: computed(() => props.disabled),
  labelPosition: computed(() => props.labelPosition),
  labelWidth,
  updateLabelWidth,
  removeLabelWidth,
  model,
  rules,
  validationVersion,
  validateOn,
})

// 控件通过 v-model 修改外部 model 后，同步到校验状态；不修改调用方的字段对象。
watch(model, (value) => form.setValues(cloneDeep(value), false), { deep: true, flush: 'sync' })

/** 保留原生提交契约，供筛选表单与回车提交使用。 */
async function submit() {
  if (props.disabled || isValidating.value) {
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
