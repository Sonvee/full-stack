<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { useAppLoading } from '@/composables/use-app-loading'
import { useAppearance } from '@/composables/use-appearance'

useAppearance()
useAppLoading()
</script>

<style lang="scss" scoped></style>
