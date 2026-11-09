import type { GenericValidateFunction, Path } from 'vee-validate'

export type SvFormTrigger = 'blur' | 'change'

/** 对象式规则；提交时执行全部规则，交互时按 trigger 筛选，未指定则两种交互均校验。 */
export interface SvFormRule {
  required?: boolean
  message?: string
  trigger?: SvFormTrigger | SvFormTrigger[]
  /** 复用 VeeValidate 返回值契约，支持同步/异步；返回 true 或空数组表示通过。 */
  validator?: GenericValidateFunction
}

/** 以表单模型的字段路径为键，组件专属规则类型就近维护。 */
export type SvFormRules<T extends object = Record<string, unknown>> = Partial<
  Record<Path<T>, SvFormRule | SvFormRule[]>
>

export type SvFormErrors = Record<string, string[]>

/** 错误对象只包含未通过的字段；异步校验过期或被清除时 valid 为 false。 */
export type SvFormValidateCallback = (valid: boolean, errors?: SvFormErrors) => void | Promise<void>

/** 表单实例的校验和重置能力；重置通过 update:model 返回初始快照。 */
export interface SvFormInstance {
  validate: (callback?: SvFormValidateCallback) => Promise<boolean>
  validateField: (prop: string | string[], callback?: SvFormValidateCallback) => Promise<boolean>
  resetFields: () => void
  clearValidate: () => void
}
