<template>
  <ElSelect
    v-model="model"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    filterable
    v-bind="$attrs"
  >
    <ElOption
      v-for="item in props.dictList"
      :key="String(item[props.valueKey])"
      :label="String(item[props.labelKey])"
      :value="item[props.valueKey]"
    />
  </ElSelect>
</template>

<script lang="ts" setup>
import { ElOption, ElSelect } from 'element-plus'

defineOptions({ inheritAttrs: false })

/** 字典下拉项；labelKey 指向展示文本，valueKey 指向保留类型的 v-model 值。 */
interface SvDictSelectProps {
  dictList: readonly Record<string, any>[]
  labelKey: string
  valueKey: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<SvDictSelectProps>(), {
  placeholder: '请选择',
  disabled: undefined,
})
const model = defineModel<any>()
</script>

<style lang="scss" scoped></style>
