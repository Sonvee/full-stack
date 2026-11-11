<template>
  <main class="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
    <h1 class="text-2xl font-semibold">Full Stack</h1>
    <el-button :tag="RouterLink" :to="{ name: 'admin-dashboard' }" type="primary">进入管理端</el-button>
  </main>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { ElButton } from 'element-plus'
</script>

<style lang="scss" scoped></style>
