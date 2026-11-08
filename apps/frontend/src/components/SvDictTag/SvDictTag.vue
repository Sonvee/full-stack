<template>
  <Badge v-if="!showText">{{ label }}</Badge>
  <template v-else>{{ label }}</template>
</template>

<script lang="ts" setup generic="T extends object, LabelKey extends keyof T, ValueKey extends keyof T">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'

/** 字典值按字符串匹配，未找到时显示原始值；text 或 text="true" 时输出纯文本。 */
interface SvDictTagProps {
  dictList: readonly T[]
  data: T[ValueKey] | null | undefined
  labelKey: LabelKey
  valueKey: ValueKey
  text?: boolean | string
}

const props = defineProps<SvDictTagProps>()
const showText = computed(() => props.text === true || props.text === 'true')
const label = computed(() => {
  const option = props.dictList.find(
    (item) => String(item[props.valueKey]) === String(props.data),
  )

  if (option) {
    return String(option[props.labelKey])
  }

  return props.data == null ? '' : String(props.data)
})
</script>

<style lang="scss" scoped></style>
