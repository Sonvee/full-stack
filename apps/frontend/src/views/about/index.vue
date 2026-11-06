<template>
  <main class="flex min-h-svh items-center bg-background px-6 py-12 text-foreground">
    <section aria-labelledby="about-title" class="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <p class="text-sm font-medium text-muted-foreground">Full Stack</p>
      <h1 id="about-title" class="text-4xl font-semibold tracking-tight sm:text-5xl">关于项目</h1>
      <p class="max-w-xl text-base leading-8 text-muted-foreground">
        Full Stack 是一个前后端分离的 TypeScript 全栈项目模板，帮助你快速开始新的应用。
      </p>
      <div>
        <Button as-child>
          <RouterLink :to="{ name: 'home' }">返回首页</RouterLink>
        </Button>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>

<style lang="scss" scoped></style>
