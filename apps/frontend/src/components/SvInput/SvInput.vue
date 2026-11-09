<template>
  <Input
    v-if="!props.clearable"
    ref="inputRef"
    v-bind="$attrs"
    v-model="value"
    :class="props.class"
    :id="inputId"
    :aria-invalid="ariaInvalid"
    :disabled="inputDisabled"
    :readonly="props.readonly"
  />
  <InputGroup v-else :class="props.class" :data-disabled="inputDisabled || undefined">
    <InputGroupInput
      ref="inputRef"
      v-bind="$attrs"
      v-model="value"
      :id="inputId"
      :aria-invalid="ariaInvalid"
      :disabled="inputDisabled"
      :readonly="props.readonly"
    />
    <InputGroupAddon v-if="canClear" align="inline-end">
      <InputGroupButton
        type="button"
        size="icon-xs"
        title="清空输入"
        @mousedown.prevent
        @click="clear"
      >
        <i class="sv-icon-close" />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>

<script lang="ts" setup>
import { computed, inject, useAttrs, useTemplateRef, type HTMLAttributes } from 'vue'
import { useFocus, useVModel } from '@vueuse/core'
import { Input } from '@/components/ui/input'
import { svFormFieldKey } from '@/components/SvForm/context'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

defineOptions({ inheritAttrs: false })

/**
 * 继承 shadcn-vue Input 的值与默认值契约，clearable 默认关闭。
 *
 * @remarks
 * 原生属性、ARIA 属性和 DOM 事件传给实际 input；class 作用于外观容器。
 * 禁用或只读时不显示清空按钮；清空统一写入空字符串。
 */
interface SvInputProps {
  modelValue?: string | number
  defaultValue?: string | number
  class?: HTMLAttributes['class']
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<SvInputProps>(), { clearable: false })
const attrs = useAttrs()
const formField = inject(svFormFieldKey, undefined)
const inputId = computed(() => (attrs.id as string | undefined) ?? formField?.id)
const ariaInvalid = computed(() => attrs['aria-invalid'] ?? formField?.invalid.value)
const inputDisabled = computed(() => props.disabled ?? formField?.disabled.value ?? false)
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  clear: []
}>()
const value = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: props.defaultValue,
})
const inputRef = useTemplateRef('inputRef')
const inputElement = computed<HTMLInputElement | undefined>(() => inputRef.value?.$el)
const { focused } = useFocus(inputElement, { preventScroll: true })
const canClear = computed(
  () =>
    !inputDisabled.value &&
    !props.readonly &&
    value.value !== undefined &&
    String(value.value).length > 0,
)

/** 清空并通知调用方；恢复焦点以便继续输入。 */
function clear() {
  value.value = ''
  focused.value = true
  emit('clear')
}

/** 将焦点移至实际输入框。 */
function focus() {
  focused.value = true
}
/** 移除实际输入框的焦点。 */
function blur() {
  focused.value = false
}
/** 选中实际输入框中的全部文本。 */
function select() {
  inputElement.value?.select()
}

defineExpose({ focus, blur, select })
</script>

<style lang="scss" scoped></style>
