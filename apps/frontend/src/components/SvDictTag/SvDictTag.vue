<template>
  <el-tag v-if="!showText">{{ label }}</el-tag>
  <template v-else>{{ label }}</template>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElTag } from 'element-plus'

/** 字典值按字符串匹配，未找到时显示原始值；text 或 text="true" 时输出纯文本。 */
interface SvDictTagProps {
  dictList: readonly Record<string, any>[]
  data: unknown
  labelKey: string
  valueKey: string
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
