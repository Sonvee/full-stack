<template>
  <div
    data-slot="sidebar-group-content"
    data-sidebar="group-content"
    :class="cn('w-full text-sm', props.class)"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<style lang="scss" scoped></style>
