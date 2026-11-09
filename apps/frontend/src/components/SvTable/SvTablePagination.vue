<template>
  <footer class="flex shrink-0 flex-wrap items-center justify-between gap-3">
    <p class="text-sm text-muted-foreground">
      共 {{ total }} 条<span v-if="selected !== undefined">，已选择 {{ selected }} 条</span>
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
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious size="icon-sm"><i class="sv-icon-chevronleft" /></PaginationPrevious>
          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === pageNum"
              size="icon-sm"
              >{{ item.value }}</PaginationItem
            >
            <PaginationEllipsis v-else>…</PaginationEllipsis>
          </template>
          <PaginationNext size="icon-sm"><i class="sv-icon-chevronright" /></PaginationNext>
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

/**
 * 独立分页栏，可用于表格或其他列表；调用方负责数据分页及页码联动。
 * total 为符合筛选条件的数据总数；selected 未传时隐藏已选数量。
 */
withDefaults(defineProps<{ total: number; selected?: number; pageSizes?: number[] }>(), {
  pageSizes: () => [10, 20, 50],
})
/** 当前页码，从 1 开始，通过 v-model:page-num 与调用方同步。 */
const pageNum = defineModel<number>('pageNum', { required: true })
/** 每页条数，通过 v-model:page-size 与调用方同步。 */
const pageSize = defineModel<number>('pageSize', { required: true })
const sizeId = `sv-table-page-size-${useId()}`
</script>

<style lang="scss" scoped></style>
