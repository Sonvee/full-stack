<template>
  <div data-slot="sheet-header" :class="cn('flex flex-col gap-1.5 p-4', props.class)">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<style lang="scss" scoped></style>
