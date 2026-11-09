import type { GenericValidateFunction } from 'vee-validate'
import type { SvFormRule, SvFormTrigger } from './types'

/** 将单条/多条对象规则统一为数组，供校验和必填标记复用。 */
export function getFormRules(rules?: SvFormRule | SvFormRule[]): SvFormRule[] {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

/** 仅适配对象式配置，规则执行与错误聚合交给 VeeValidate。 */
export function createValidators(rules: SvFormRule[], trigger?: SvFormTrigger): GenericValidateFunction[] {
  return rules
    .filter((rule) => !trigger || !rule.trigger || [rule.trigger].flat().includes(trigger))
    .map((rule) => async (value, context) => {
      const empty = value == null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && !value.length)
      if (rule.required && empty) {
        return rule.message || '此项为必填项'
      }
      if (!rule.validator) {
        return true
      }
      const result = await rule.validator(value, context)
      const failed = result === false || typeof result === 'string' || (Array.isArray(result) && result.length > 0)
      return failed && rule.message ? rule.message : result
    })
}
