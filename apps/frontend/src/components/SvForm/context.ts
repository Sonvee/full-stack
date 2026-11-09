import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { SvFormLabelPosition, SvFormRules, SvFormTrigger } from './types'

/** 同一表单内字段共享的交互配置；校验状态由 VeeValidate 自身上下文提供。 */
export interface SvFormContext {
  disabled: ComputedRef<boolean>
  labelPosition: ComputedRef<SvFormLabelPosition>
  labelWidth: ComputedRef<string>
  /** 记录标签自然宽度，auto 模式以当前可见标签的最大宽度统一对齐。 */
  updateLabelWidth: (key: symbol, width: number) => void
  removeLabelWidth: (key: symbol) => void
  model: Readonly<Ref<Record<string, unknown>>>
  rules: ComputedRef<SvFormRules>
  validationVersion: Readonly<Ref<number>>
  validateOn: (prop: string, trigger: SvFormTrigger) => Promise<boolean>
}

/** 表单项向其直接控件提供的标签关联、校验和禁用状态。 */
export interface SvFormFieldContext {
  id: string
  invalid: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
}

/** 将 SvFormItem 绑定至最近的 SvForm，避免多个表单之间串用配置。 */
export const svFormKey: InjectionKey<SvFormContext> = Symbol('SvForm')

/** 将字段状态绑定至表单项内最近的自定义输入控件。 */
export const svFormFieldKey: InjectionKey<SvFormFieldContext> = Symbol('SvFormField')
