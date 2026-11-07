<template>
  <CollapsibleContent data-slot="collapsible-content" v-bind="props">
    <slot />
  </CollapsibleContent>
</template>

<script lang="ts" setup>
import type { CollapsibleContentProps } from 'reka-ui'
import { CollapsibleContent } from 'reka-ui'

const props = defineProps<CollapsibleContentProps>()
</script>

<style lang="scss" scoped></style>
