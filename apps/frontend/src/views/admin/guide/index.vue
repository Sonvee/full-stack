<template>
  <section class="flex max-w-3xl flex-col gap-6 py-2" aria-labelledby="guide-title">
    <div class="flex flex-col gap-2">
      <h1 id="guide-title" class="text-2xl font-semibold tracking-tight">布局说明</h1>
      <p class="text-sm leading-6 text-muted-foreground">
        管理端参考 shadcn-vue sidebar-08，采用侧栏导航与内嵌内容区布局。
      </p>
    </div>
    <Separator />
    <div class="flex flex-col gap-3">
      <h2 class="font-medium">侧栏与导航</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        左上角按钮可以展开或收起侧栏，也可以使用 Ctrl+B（macOS 使用
        ⌘B）。点击「页面示例」「系统演示」等菜单可以展开或收起子菜单。
      </p>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="font-medium">移动端适配</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        小屏幕下导航以抽屉形式打开，选中页面后自动收起。点击遮罩或按 Escape 也可以关闭导航。
      </p>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="font-medium">页面内容</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        不同页面共享同一套布局，菜单选中状态与顶部面包屑随当前页面更新。一级页面可以直接访问消息中心，二级页面位于「页面示例」，三级页面位于「系统演示
        → 权限管理」。直接打开深层链接时，对应菜单会自动展开。
      </p>
    </div>
    <div>
      <Button as-child variant="outline">
        <RouterLink :to="{ name: 'admin-dashboard' }">返回工作台</RouterLink>
      </Button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
</script>

<style lang="scss" scoped></style>
