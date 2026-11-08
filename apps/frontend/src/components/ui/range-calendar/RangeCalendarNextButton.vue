<template>
  <RangeCalendarNext
    data-slot="range-calendar-next-button"
    aria-label="下个月"
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'absolute right-1',
        'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot>
      <i class="sv-icon-chevronright" aria-hidden="true" />
    </slot>
  </RangeCalendarNext>
</template>

<script lang="ts" setup>
import type { RangeCalendarNextProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { cn } from 'cn'
import { RangeCalendarNext, useForwardProps } from 'reka-ui'
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<RangeCalendarNextProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<style lang="scss" scoped></style>
