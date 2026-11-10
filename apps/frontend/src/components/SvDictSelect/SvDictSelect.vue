<template>
  <Combobox v-model="model" :disabled="selectDisabled">
    <ComboboxAnchor as-child class="w-full">
      <ComboboxTrigger as-child>
        <Button
          v-bind="$attrs"
          :id="inputId"
          :aria-invalid="ariaInvalid"
          variant="outline"
          :class="cn('w-full justify-between', props.class)"
        >
          <span :class="cn('truncate', selectedLabel == null && 'text-muted-foreground')">
            {{ selectedLabel ?? props.placeholder }}
          </span>
          <i class="sv-icon-chevrondown opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxList class="w-(--reka-combobox-trigger-width)">
      <ComboboxInput placeholder="搜索选项" :display-value="() => ''" />
      <ComboboxViewport>
        <ComboboxEmpty>暂无匹配选项</ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxItem
            v-for="item in props.dictList"
            :key="String(item[props.valueKey])"
            :value="item[props.valueKey]"
            :text-value="String(item[props.labelKey])"
          >
            {{ String(item[props.labelKey]) }}
            <ComboboxItemIndicator>
              <i class="sv-icon-check" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxList>
  </Combobox>
</template>

<script lang="ts" setup>
import { computed, inject, useAttrs, type HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
  ComboboxViewport,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'
import { svFormFieldKey } from '@/components/SvForm/context'

defineOptions({ inheritAttrs: false })

/** 字典下拉项；labelKey 指向展示文本，valueKey 指向保留类型的 v-model 值。 */
interface SvDictSelectProps {
  dictList: readonly Record<string, any>[]
  labelKey: string
  valueKey: string
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
const selectDisabled = computed(() => props.disabled ?? formField?.disabled.value ?? false)
const model = defineModel<any>()
const selectedLabel = computed(() =>
  props.dictList.find((item) => item[props.valueKey] === model.value)?.[props.labelKey],
)
</script>

<style lang="scss" scoped></style>
