<template>
  <PopoverAnchor data-slot="popover-anchor" v-bind="props">
    <slot />
  </PopoverAnchor>
</template>

<script lang="ts" setup>
import type { PopoverAnchorProps } from 'reka-ui'
import { PopoverAnchor } from 'reka-ui'

const props = defineProps<PopoverAnchorProps>()
</script>

<style lang="scss" scoped></style>
