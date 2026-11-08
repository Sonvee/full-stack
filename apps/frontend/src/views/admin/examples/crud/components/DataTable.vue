<template>
  <SvTable
    v-model:page-num="pageNum"
    v-model:page-size="pageSize"
    :data="records"
    row-key="id"
    :filters="columnFilters"
    pagination
    table-class="min-w-[1180px]"
    class="min-h-48"
    caption="通用数据列表，包含数据编号、数据项甲至庚及创建日期"
    @selection-change="emit('selectionChange', $event)"
    @filtered-change="emit('filteredChange', $event)"
  >
    <SvTableColumn type="selection" />
    <SvTableColumn prop="id" label="数据编号" />
    <!-- @vue-generic {DataRecord} -->
    <SvTableColumn
      v-for="field in fields"
      :key="field.name"
      :prop="field.name"
      :label="field.label"
      :filter-type="field.options ? 'equalsString' : 'includesString'"
      :sortable="field.name === 'a-input'"
    >
      <template #default="{ row }">
        <Badge
          v-if="field.name === 'f-select'"
          :variant="row['f-select'] === '选项甲' ? 'default' : 'secondary'"
          >{{ row['f-select'] }}</Badge
        >
        <template v-else>{{ row[field.name] }}</template>
      </template>
    </SvTableColumn>
    <SvTableColumn prop="createdAt" label="创建日期" filter-type="inDateRange" sortable />
    <!-- @vue-generic {DataRecord} -->
    <SvTableColumn column-key="actions" label="操作" :width="132">
      <template #default="{ row }">
        <div class="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            :aria-label="`编辑数据 ${row.id}`"
            @click="emit('edit', row)"
            >编辑</Button
          >
          <Button
            variant="ghost"
            size="sm"
            :aria-label="`删除数据 ${row.id}`"
            @click="emit('delete', [row])"
            >删除</Button
          >
        </div>
      </template>
    </SvTableColumn>
    <template #empty>
      <Empty class="py-12"
        ><EmptyHeader
          ><EmptyTitle>暂无数据</EmptyTitle
          ><EmptyDescription>可以调整筛选条件，或新增一条数据。</EmptyDescription></EmptyHeader
        ><EmptyContent
          ><Button variant="outline" size="sm" @click="emit('create')"
            >新增数据</Button
          ></EmptyContent
        ></Empty
      >
    </template>
  </SvTable>
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import type { ColumnFiltersState } from '@tanstack/vue-table'
import SvTable from '@/components/SvTable/SvTable.vue'
import SvTableColumn from '@/components/SvTable/SvTableColumn.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { fields, type DataRecord, type FilterValues } from '../data-model'

const { records, filters } = defineProps<{
  records: DataRecord[]
  filters: FilterValues
}>()
const emit = defineEmits<{
  create: []
  edit: [record: DataRecord]
  delete: [records: DataRecord[]]
  selectionChange: [records: DataRecord[]]
  filteredChange: [records: DataRecord[]]
}>()
const pageNum = shallowRef(1)
const pageSize = shallowRef(10)

/** 将筛选表单映射为列条件，日期边界由 TanStack 的日期范围筛选器处理。 */
const columnFilters = computed<ColumnFiltersState>(() => {
  const result = Object.entries(filters)
    .filter(([key, value]) => key !== 'createdFrom' && key !== 'createdTo' && value)
    .map(([id, value]) => ({ id, value })) as ColumnFiltersState
  if (filters.createdFrom || filters.createdTo)
    result.push({ id: 'createdAt', value: [filters.createdFrom, filters.createdTo] })
  return result
})
</script>

<style lang="scss" scoped></style>
