<template>
  <main class="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
    <h1 class="text-2xl font-semibold">Full Stack</h1>
    <Button as-child>
      <RouterLink :to="{ name: 'admin-dashboard' }">进入管理端</RouterLink>
    </Button>
  </main>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>

<style lang="scss" scoped></style>
