<template>
  <div data-slot="skeleton" :class="cn('animate-pulse rounded-md bg-primary/10', props.class)" />
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

interface SkeletonProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<SkeletonProps>()
</script>

<style lang="scss" scoped></style>
