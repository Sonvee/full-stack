<template>
  <RouterView />
  <Toaster :theme="mode === 'auto' ? 'system' : mode" position="top-center" close-button />
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import { useAppLoading } from '@/composables/use-app-loading'
import { useAppearance } from '@/composables/use-appearance'

const { mode } = useAppearance()
useAppLoading()
</script>

<style lang="scss" scoped></style>
