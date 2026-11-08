<template>
  <div
    class="flex shrink-0 flex-wrap items-center justify-between gap-3"
    role="group"
    aria-label="表格工具栏"
  >
    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      <Button size="sm" @click="emit('create')">
        <i class="sv-icon-plus" aria-hidden="true" data-icon="inline-start" />新增数据
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!selection.length"
        @click="emit('delete', selection)"
      >
        <i class="sv-icon-delete" aria-hidden="true" data-icon="inline-start" />批量删除
        <span v-if="selection.length">({{ selection.length }})</span>
      </Button>
      <slot />
    </div>
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="刷新数据"
        title="刷新数据"
        @click="emit('refresh')"
      >
        <i class="sv-icon-refresh" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        :aria-label="showFilters ? '隐藏筛选栏' : '显示筛选栏'"
        :title="showFilters ? '隐藏筛选栏' : '显示筛选栏'"
        :aria-expanded="showFilters"
        aria-controls="record-filters"
        @click="emit('toggleFilters')"
      >
        <i :class="cn(showFilters ? 'sv-icon-eyeoff' : 'sv-icon-filter')" aria-hidden="true" />
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DataRecord } from '../data-model'

/** 工具栏仅接收页面提供的选择结果和筛选栏状态；操作通过事件交给页面执行。 */
defineProps<{ selection: DataRecord[]; showFilters: boolean }>()
const emit = defineEmits<{
  create: []
  delete: [records: DataRecord[]]
  refresh: []
  toggleFilters: []
}>()
</script>

<style lang="scss" scoped></style>
