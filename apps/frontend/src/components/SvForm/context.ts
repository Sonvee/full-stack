import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { SvFormRules, SvFormTrigger } from './types'

/** 同一表单内字段共享的交互配置；校验状态由 VeeValidate 自身上下文提供。 */
export interface SvFormContext {
  disabled: ComputedRef<boolean>
  model: Readonly<Ref<Record<string, unknown>>>
  rules: ComputedRef<SvFormRules>
  validationVersion: Readonly<Ref<number>>
  validateOn: (prop: string, trigger: SvFormTrigger) => Promise<boolean>
}

/** 表单项向其直接控件提供的无障碍、校验和禁用状态。 */
export interface SvFormFieldContext {
  id: string
  invalid: ComputedRef<boolean>
  errorId: ComputedRef<string | undefined>
  disabled: ComputedRef<boolean>
}

/** 将 SvFormItem 绑定至最近的 SvForm，避免多个表单之间串用配置。 */
export const svFormKey: InjectionKey<SvFormContext> = Symbol('SvForm')

/** 将字段状态绑定至表单项内最近的自定义输入控件。 */
export const svFormFieldKey: InjectionKey<SvFormFieldContext> = Symbol('SvFormField')
