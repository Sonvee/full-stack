<template>
  <option
    data-slot="native-select-option"
    :class="cn('bg-popover text-popover-foreground', props.class)"
  >
    <slot />
  </option>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from 'cn'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<style lang="scss" scoped></style>
