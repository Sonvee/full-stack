<template><span ref="markerRef" /></template>

<script lang="ts" setup generic="T extends object = Record<string, unknown>">
import { inject, onBeforeUnmount, useId, useTemplateRef, type VNode } from 'vue'
import { svTableKey } from './context'
import type { SvTableCellScope, SvTableColumnProps } from './types'

/** 声明一列；默认插槽自定义单元格，header 插槽自定义表头。 */
const props = withDefaults(defineProps<SvTableColumnProps>(), { type: 'default', sortable: false })
const slots = defineSlots<{
  default?: (scope: SvTableCellScope<T>) => VNode[]
  header?: () => VNode[]
}>()
const context = inject(svTableKey)
if (!context) {
  throw new Error('SvTableColumn 必须位于 SvTable 内')
}
const id = useId()
const markerRef = useTemplateRef<HTMLElement>('markerRef')
context.register({
  id,
  props,
  getElement: () => markerRef.value,
  // provide/inject 无法保留父表格的泛型；调用方通过列泛型声明插槽行类型。
  cell: slots.default ? (scope) => slots.default!({ ...scope, row: scope.row as T }) : undefined,
  header: slots.header ? () => slots.header!() : undefined,
})
onBeforeUnmount(() => context.unregister(id))
</script>

<style lang="scss" scoped></style>
