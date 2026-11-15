<template>
  <el-select
    v-model="model"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :multiple="props.multiple"
    filterable
    v-bind="$attrs"
  >
    <template v-if="props.checkAll && props.multiple" #header>
      <el-checkbox
        class="flex! h-auto!"
        :model-value="allChecked"
        :indeterminate="indeterminate"
        :disabled="props.disabled || props.dictList.length === 0"
        @change="toCheckAll"
      >
        全选
      </el-checkbox>
    </template>
    <el-option
      v-for="item in props.dictList"
      :key="String(item[props.valueKey])"
      :label="String(item[props.labelKey])"
      :value="item[props.valueKey]"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElCheckbox } from 'element-plus'
import type { CheckboxValueType } from 'element-plus'

defineOptions({ inheritAttrs: false })

/** 字典下拉项；labelKey 指向展示文本，valueKey 指向保留类型的 v-model 值。 */
interface SvDictSelectProps {
  dictList: readonly Record<string, any>[]
  labelKey: string
  valueKey: string
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  /** 仅在多选模式下显示全选操作。 */
  checkAll?: boolean
}

const props = withDefaults(defineProps<SvDictSelectProps>(), {
  placeholder: '请选择',
  disabled: undefined,
  multiple: false,
  checkAll: false,
})
const model = defineModel<any>()

const selectedCount = computed(() => {
  const selectedValues = Array.isArray(model.value) ? model.value : []
  return props.dictList.filter((item) => selectedValues.includes(item[props.valueKey])).length
})
const allChecked = computed(() => props.dictList.length > 0 && selectedCount.value === props.dictList.length)
const indeterminate = computed(() => selectedCount.value > 0 && !allChecked.value)

/** 全选时保留字典值的原始类型，取消全选时清空选择。 */
function toCheckAll(checked: CheckboxValueType) {
  model.value = checked ? props.dictList.map((item) => item[props.valueKey]) : []
}
</script>

<style lang="scss" scoped></style>
