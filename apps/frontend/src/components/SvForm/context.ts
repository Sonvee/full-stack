import type { ComputedRef, InjectionKey } from 'vue'

/** 同一表单内字段共享的交互配置；校验状态由 VeeValidate 自身上下文提供。 */
export interface SvFormContext {
  disabled: ComputedRef<boolean>
}

/** 将 SvFormItem 绑定至最近的 SvForm，避免多个表单之间串用配置。 */
export const svFormKey: InjectionKey<SvFormContext> = Symbol('SvForm')
