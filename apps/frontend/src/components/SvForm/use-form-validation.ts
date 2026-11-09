import { nextTick, onScopeDispose, shallowRef, type ComputedRef, type Ref } from 'vue'
import { cloneDeep, isEqual } from 'es-toolkit'
import { get } from 'es-toolkit/compat'
import { validate as validateValue, type FormContext } from 'vee-validate'
import type { SvFormErrors, SvFormRules, SvFormTrigger, SvFormValidateCallback } from './types'
import { createValidators, getFormRules } from './validation'

/** 维护对象式规则的触发时机与异步生命周期，值和错误状态仍交由 VeeValidate 管理。 */
export function useFormValidation(
  model: Readonly<Ref<Record<string, unknown>>>,
  rules: ComputedRef<SvFormRules>,
  form: FormContext<Record<string, unknown>>,
) {
  const validationVersion = shallowRef(0)
  const isValidating = shallowRef(false)
  const requests = new Map<string, symbol>()

  /** 清除或重置后，尚未结束的异步规则不得回写错误。 */
  function invalidate() {
    validationVersion.value += 1
    requests.clear()
    isValidating.value = false
  }
  onScopeDispose(invalidate)

  async function validateProps(props: string[], trigger?: SvFormTrigger) {
    const version = validationVersion.value
    const values = cloneDeep(model.value)
    const errors: SvFormErrors = {}
    const results = await Promise.all(props.map(async (prop) => {
      const validators = createValidators(getFormRules(rules.value[prop]), trigger)
      if (trigger && !validators.length) {
        return true
      }
      const token = Symbol(prop)
      requests.set(prop, token)
      const result = await validateValue(get(values, prop), validators, { name: prop, values })
      if (version !== validationVersion.value || requests.get(prop) !== token || !isEqual(values, model.value)) {
        return false
      }
      form.setFieldError(prop, result.errors)
      if (!result.valid) {
        errors[prop] = result.errors
      }
      return result.valid
    }))
    return { valid: version === validationVersion.value && isEqual(values, model.value) && results.every(Boolean), errors }
  }

  /** 完整校验不会受 trigger 限制，也会检查当前未挂载但已配置规则的字段。 */
  async function validate(callback?: SvFormValidateCallback): Promise<boolean> {
    invalidate()
    const version = validationVersion.value
    isValidating.value = true
    try {
      await nextTick()
      if (version !== validationVersion.value) {
        return false
      }
      const props = [...new Set([...Object.keys(rules.value), ...Object.keys(form.errors.value)])]
      const result = await validateProps(props)
      await callback?.(result.valid, result.valid ? undefined : result.errors)
      return result.valid
    } finally {
      if (version === validationVersion.value) {
        isValidating.value = false
      }
    }
  }

  async function validateField(prop: string | string[], callback?: SvFormValidateCallback): Promise<boolean> {
    const result = await validateProps([...new Set(Array.isArray(prop) ? prop : [prop])])
    await callback?.(result.valid, result.valid ? undefined : result.errors)
    return result.valid
  }

  async function validateOn(prop: string, trigger: SvFormTrigger): Promise<boolean> {
    return (await validateProps([prop], trigger)).valid
  }

  function clearValidate() {
    invalidate()
    for (const prop of Object.keys(form.errors.value)) {
      form.setFieldError(prop, undefined)
    }
  }

  return { validationVersion, isValidating, validate, validateField, validateOn, clearValidate }
}
