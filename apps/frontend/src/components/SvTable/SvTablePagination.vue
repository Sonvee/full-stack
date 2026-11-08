<template>
  <footer class="flex shrink-0 flex-wrap items-center justify-between gap-3">
    <p class="text-sm text-muted-foreground" role="status">
      共 {{ total }} 条，已选择 {{ selected }} 条
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <label :for="sizeId" class="text-sm text-muted-foreground">每页</label>
        <Select :model-value="String(pageSize)" @update:model-value="pageSize = Number($event)">
          <SelectTrigger :id="sizeId" size="sm" class="w-20"><SelectValue /></SelectTrigger>
          <SelectContent
            ><SelectGroup>
              <SelectItem v-for="size in pageSizes" :key="size" :value="String(size)"
                >{{ size }} 条</SelectItem
              >
            </SelectGroup></SelectContent
          >
        </Select>
      </div>
      <Pagination
        v-model:page="pageNum"
        :total="total"
        :items-per-page="pageSize"
        :sibling-count="0"
        show-edges
        class="w-auto"
        aria-label="数据列表分页"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious size="icon-sm" aria-label="上一页"
            ><i class="sv-icon-chevronleft" aria-hidden="true"
          /></PaginationPrevious>
          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === pageNum"
              size="icon-sm"
              :aria-label="`第 ${item.value} 页`"
              >{{ item.value }}</PaginationItem
            >
            <PaginationEllipsis v-else :index="index"
              ><span aria-hidden="true">…</span
              ><span class="sr-only">更多页码</span></PaginationEllipsis
            >
          </template>
          <PaginationNext size="icon-sm" aria-label="下一页"
            ><i class="sv-icon-chevronright" aria-hidden="true"
          /></PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useId } from 'vue'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/** 仅负责分页栏展示；页码从 1 开始，分页计算由父表格交给 TanStack 处理。 */
defineProps<{ total: number; selected: number; pageSizes: number[] }>()
/** 当前页码，从 1 开始，与 SvTable 对外字段保持一致。 */
const pageNum = defineModel<number>('pageNum', { required: true })
/** 每页条数，由 SvTable 负责联动重置页码。 */
const pageSize = defineModel<number>('pageSize', { required: true })
const sizeId = `sv-table-page-size-${useId()}`
</script>

<style lang="scss" scoped></style>
