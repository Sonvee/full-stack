<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <i class="sv-icon-checkboxmarkedcircleoutline" aria-hidden="true" />
    </template>
    <template #info-icon>
      <i class="sv-icon-informationoutline" aria-hidden="true" />
    </template>
    <template #warning-icon>
      <i class="sv-icon-alertoutline" aria-hidden="true" />
    </template>
    <template #error-icon>
      <i class="sv-icon-closeoctagonoutline" aria-hidden="true" />
    </template>
    <template #loading-icon>
      <div>
        <i class="sv-icon-refresh animate-spin" aria-hidden="true" />
      </div>
    </template>
    <template #close-icon>
      <i class="sv-icon-close" aria-hidden="true" />
    </template>
  </Sonner>
</template>

<script lang="ts" setup>
import type { ToasterProps } from 'vue-sonner'
import { cn } from 'cn'
import { Toaster as Sonner } from 'vue-sonner'

/** 保留 Sonner 全部配置，并复用项目主题变量与 iconfont 图标。 */
const props = defineProps<ToasterProps>()
</script>

<style lang="scss" scoped></style>
