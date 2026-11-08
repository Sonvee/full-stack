<template>
  <div
    data-slot="table-container"
    :class="cn('relative w-full overflow-auto', props.containerClass)"
  >
    <table data-slot="table" :class="cn('w-full caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
  /** 约束滚动容器高度；class 继续作用于 table 本身。 */
  containerClass?: HTMLAttributes['class']
}>()
</script>

<style lang="scss" scoped></style>
