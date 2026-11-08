<template>
  <Select :model-value="selectedValue" @update:model-value="updateValue">
    <SelectTrigger
      v-bind="$attrs"
      :id="inputId"
      :aria-invalid="ariaInvalid"
      :aria-describedby="ariaDescribedby"
      :class="cn('w-full', props.class)"
      :disabled="selectDisabled"
    >
      <SelectValue :placeholder="props.placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in props.dictList"
          :key="String(item[props.valueKey])"
          :value="String(item[props.valueKey])"
        >
          {{ String(item[props.labelKey]) }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script lang="ts" setup generic="T extends object, LabelKey extends keyof T, ValueKey extends keyof T">
import { computed, inject, useAttrs, type HTMLAttributes } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { svFormFieldKey } from '@/components/SvForm/context'

defineOptions({ inheritAttrs: false })

/** 字典下拉项；labelKey 指向展示文本，valueKey 指向保留类型的 v-model 值。 */
interface SvDictSelectProps {
  dictList: readonly T[]
  labelKey: LabelKey
  valueKey: ValueKey
  placeholder?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SvDictSelectProps>(), {
  placeholder: '请选择',
})
const attrs = useAttrs()
const formField = inject(svFormFieldKey, undefined)
const inputId = computed(() => (attrs.id as string | undefined) ?? formField?.id)
const ariaInvalid = computed(() => attrs['aria-invalid'] ?? formField?.invalid.value)
const ariaDescribedby = computed(
  () => attrs['aria-describedby'] ?? formField?.errorId.value,
)
const selectDisabled = computed(() => props.disabled ?? formField?.disabled.value ?? false)
const model = defineModel<T[ValueKey]>()
const selectedValue = computed(() =>
  model.value == null ? undefined : String(model.value),
)

/**
 * 将 Select 的字符串选项还原为字典中的原始值。
 * @param value - 选中的值；null 或 undefined 表示清空选择。
 */
function updateValue(value: unknown) {
  if (value == null) {
    model.value = undefined
    return
  }

  const option = props.dictList.find(
    (item) => String(item[props.valueKey]) === String(value),
  )

  if (option) {
    model.value = option[props.valueKey]
  }
}
</script>

<style lang="scss" scoped></style>
