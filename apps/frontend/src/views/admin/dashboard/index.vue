<template>
  <section class="flex flex-1 flex-col gap-4">
    <div class="flex flex-col gap-1 py-2">
      <h1 class="text-2xl font-semibold tracking-tight">工作台</h1>
      <p class="text-sm text-muted-foreground">欢迎使用 Full Stack 管理控制台。</p>
    </div>
    <div class="flex flex-col gap-4 md:flex-row">
      <div v-for="index in 3" :key="index" class="aspect-video flex-1 rounded-xl bg-muted/50" />
    </div>
    <div
      class="flex min-h-80 flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-muted/50 p-6 text-center"
    >
      <h2 class="text-lg font-medium">从这里开始构建你的管理端</h2>
      <p class="max-w-md text-sm leading-6 text-muted-foreground">
        这里是页面内容区。你可以替换上方的布局占位，逐步添加业务页面。
      </p>
      <ElButton :tag="RouterLink" :to="{ name: 'admin-guide' }" class="mt-2">查看布局说明</ElButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { ElButton } from 'element-plus'
</script>

<style lang="scss" scoped></style>
