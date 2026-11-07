<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { useAppearance } from '@/composables/use-appearance'

useAppearance()
</script>

<style lang="scss" scoped></style>
