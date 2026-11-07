<template>
  <CollapsibleTrigger data-slot="collapsible-trigger" v-bind="props">
    <slot />
  </CollapsibleTrigger>
</template>

<script lang="ts" setup>
import type { CollapsibleTriggerProps } from 'reka-ui'
import { CollapsibleTrigger } from 'reka-ui'

const props = defineProps<CollapsibleTriggerProps>()
</script>

<style lang="scss" scoped></style>
