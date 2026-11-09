<template>
  <section class="flex max-w-3xl flex-col gap-6 py-2">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold tracking-tight">按钮交互</h1>
      <p class="text-sm text-muted-foreground">二级页面示例 · 页面示例 / 按钮交互</p>
    </div>
    <div class="flex flex-col gap-4 rounded-xl border p-6">
      <h2 class="font-medium">基础样式</h2>
      <div class="flex flex-wrap gap-3">
        <Button @click="count++">主要按钮</Button>
        <Button variant="secondary" @click="count++">次要按钮</Button>
        <Button variant="outline" @click="count++">描边按钮</Button>
        <Button variant="ghost" @click="count++">轻量按钮</Button>
        <Button disabled>禁用按钮</Button>
      </div>
      <Separator />
      <div class="flex flex-wrap items-center justify-between gap-4">
        <p class="text-sm text-muted-foreground" role="status">已点击 {{ count }} 次</p>
        <Button variant="outline" size="sm" :disabled="count === 0" @click="count = 0"
          >重置计数</Button
        >
      </div>
    </div>
    <div class="flex flex-col gap-4 rounded-xl border p-6">
      <h2 class="font-medium">页面跳转</h2>
      <p class="text-sm leading-6 text-muted-foreground">
        通过内容区链接切换页面，侧栏和面包屑会同步更新。
      </p>
      <div class="flex flex-wrap gap-3">
        <Button as-child variant="outline"
          ><RouterLink :to="{ name: 'admin-typography' }">查看同级页面</RouterLink></Button
        >
        <Button as-child variant="outline"
          ><RouterLink :to="{ name: 'admin-roles' }">进入三级页面</RouterLink></Button
        >
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const count = shallowRef(0)
</script>

<style lang="scss" scoped></style>
