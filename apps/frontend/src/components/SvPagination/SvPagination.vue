<template>
  <el-pagination
    v-bind="$attrs"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="props.total"
    :page-sizes="props.pageSizes"
    :layout="layout"
    @size-change="currentPage = 1"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import type { PaginationPropsPublic } from 'element-plus'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Pick<PaginationPropsPublic, 'total' | 'pageSizes'>>(), {
  pageSizes: () => [10, 20, 50, 100],
})
const currentPage = defineModel<number>('currentPage', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })
const isMobile = useMediaQuery('(max-width: 767px)')
const layout = computed(() =>
  isMobile.value
    ? 'total, prev, pager, next'
    : 'total, sizes, prev, pager, next, jumper',
)
</script>

<style lang="scss" scoped></style>
