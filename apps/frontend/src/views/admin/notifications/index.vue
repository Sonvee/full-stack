<template>
  <section class="flex max-w-3xl flex-col gap-6 py-2">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold tracking-tight">消息中心</h1>
        <p class="text-sm text-muted-foreground">一级页面示例 · 以下为本地演示消息。</p>
      </div>
      <el-button :disabled="allRead" @click="allRead = true">全部标为已读</el-button>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ allRead ? '所有消息已读' : '有 3 条未读消息' }}
    </p>
    <ul class="flex flex-col gap-4">
      <li
        v-for="message in messages"
        :key="message.title"
        class="flex flex-col gap-2 rounded-xl border p-5"
      >
        <div class="flex items-center justify-between gap-4">
          <h2 class="font-medium">{{ message.title }}</h2>
          <span class="shrink-0 text-xs text-muted-foreground">{{
            allRead ? '已读' : '未读'
          }}</span>
        </div>
        <p class="text-sm leading-6 text-muted-foreground">{{ message.description }}</p>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { ElButton } from 'element-plus'

const allRead = shallowRef(false)
const messages = [
  { title: '欢迎使用管理控制台', description: '从侧栏进入不同层级的页面，体验统一的管理端布局。' },
  { title: '页面示例已就绪', description: '打开「页面示例」，查看按钮交互和内容排版。' },
  { title: '多级导航演示', description: '打开「系统演示 → 权限管理」，体验三级菜单与面包屑。' },
]
</script>

<style lang="scss" scoped></style>
