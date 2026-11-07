<template>
  <Separator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    :class="cn('bg-sidebar-border mx-2 w-auto', props.class)"
  >
    <slot />
  </Separator>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<style lang="scss" scoped></style>
