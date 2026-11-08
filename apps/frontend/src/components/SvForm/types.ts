import type { GenericValidateFunction } from 'vee-validate'

/**
 * 以字段名或 VeeValidate 字段路径为键的校验规则。
 *
 * @remarks
 * 规则复用 VeeValidate 的同步/异步函数契约，可返回 true、false 或错误信息。
 * 多条规则使用函数数组，不兼容 Element Plus 的 async-validator 规则对象。
 */
export type SvFormRules = Partial<
  Record<string, GenericValidateFunction | GenericValidateFunction[]>
>

/** 表单实例的校验和重置能力；重置通过 update:model 返回初始快照。 */
export interface SvFormInstance {
  validate: () => Promise<boolean>
  validateField: (prop: string) => Promise<boolean>
  resetFields: () => void
  clearValidate: () => void
}
