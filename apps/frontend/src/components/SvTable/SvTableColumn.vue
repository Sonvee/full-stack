<template><span ref="markerRef" /></template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, useId, useTemplateRef, type VNode } from 'vue'
import { svTableKey } from './context'
import type { SvTableCellScope, SvTableColumnProps } from './types'

/** 声明一列；默认插槽自定义单元格，header 插槽自定义表头。 */
const props = withDefaults(defineProps<SvTableColumnProps>(), { type: 'default', sortable: false })
const slots = defineSlots<{
  default?: (scope: SvTableCellScope) => VNode[]
  header?: () => VNode[]
}>()
const context = inject(svTableKey)
if (!context) {
  throw new Error('SvTableColumn 必须位于 SvTable 内')
}
const id = useId()
const markerRef = useTemplateRef('markerRef')
context.register({
  id,
  props,
  getElement: () => markerRef.value,
  cell: slots.default,
  header: slots.header ? () => slots.header!() : undefined,
})
onBeforeUnmount(() => context.unregister(id))
</script>

<style lang="scss" scoped></style>
