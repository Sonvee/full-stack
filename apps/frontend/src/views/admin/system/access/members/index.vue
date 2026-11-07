<template>
  <section class="flex max-w-4xl flex-col gap-6 py-2" aria-labelledby="members-title">
    <div class="flex flex-col gap-2">
      <h1 id="members-title" class="text-2xl font-semibold tracking-tight">成员列表</h1>
      <p class="text-sm text-muted-foreground">三级页面示例 · 系统演示 / 权限管理 / 成员列表</p>
    </div>
    <p class="text-sm leading-6 text-muted-foreground">
      以下为静态演示成员，展示同一分组下的页面切换。
    </p>
    <ul class="flex flex-col gap-4">
      <li
        v-for="member in members"
        :key="member.email"
        class="flex flex-wrap items-center gap-4 rounded-xl border p-5"
      >
        <Avatar
          ><AvatarFallback>{{ member.initials }}</AvatarFallback></Avatar
        >
        <div class="flex min-w-0 flex-1 flex-col gap-1">
          <h2 class="font-medium">{{ member.name }}</h2>
          <p class="truncate text-sm text-muted-foreground">{{ member.email }}</p>
        </div>
        <span class="text-sm text-muted-foreground">{{ member.role }}</span>
      </li>
    </ul>
    <div>
      <Button as-child variant="outline"
        ><RouterLink :to="{ name: 'admin-roles' }">查看角色列表</RouterLink></Button
      >
    </div>
  </section>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const members = [
  { name: '演示管理员', initials: 'AD', email: 'admin@example.com', role: '管理员' },
  { name: '演示编辑者', initials: 'ED', email: 'editor@example.com', role: '编辑者' },
  { name: '演示观察者', initials: 'OB', email: 'observer@example.com', role: '观察者' },
]
</script>

<style lang="scss" scoped></style>
