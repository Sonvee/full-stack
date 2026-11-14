<template>
  <el-tag v-if="!showText" :type="option?.type">{{ label }}</el-tag>
  <template v-else>{{ label }}</template>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

/** 字典值按字符串匹配，标签样式取字典项的 type；未找到时显示原始值，text 或 text="true" 时输出纯文本。 */
interface SvDictTagProps {
  dictList: readonly Record<string, any>[]
  data: unknown
  labelKey: string
  valueKey: string
  text?: boolean | string
}

const props = defineProps<SvDictTagProps>()
const showText = computed(() => props.text === true || props.text === 'true')
const option = computed(() => {
  return props.dictList.find(
    (item) => String(item[props.valueKey]) === String(props.data),
  )
})

const label = computed(() => {
  if (option.value) {
    return String(option.value[props.labelKey])
  }

  return props.data == null ? '' : String(props.data)
})
</script>

<style lang="scss" scoped></style>
