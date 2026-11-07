<template>
  <div
    data-slot="field-content"
    :class="cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', props.class)"
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
