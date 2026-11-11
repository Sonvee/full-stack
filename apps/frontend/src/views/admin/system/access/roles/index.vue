<template>
  <section class="flex max-w-4xl flex-col gap-6 py-2">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold tracking-tight">角色列表</h1>
      <p class="text-sm text-muted-foreground">三级页面示例 · 系统演示 / 权限管理 / 角色列表</p>
    </div>
    <p class="text-sm leading-6 text-muted-foreground">
      以下角色仅用于展示页面内容，不会影响实际访问权限。
    </p>
    <ul class="flex flex-col gap-4">
      <li
        v-for="role in roles"
        :key="role.name"
        class="flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex flex-col gap-2">
          <h2 class="font-medium">{{ role.name }}</h2>
          <p class="text-sm leading-6 text-muted-foreground">{{ role.description }}</p>
        </div>
        <span class="shrink-0 text-sm text-muted-foreground">{{ role.members }} 位演示成员</span>
      </li>
    </ul>
    <div>
      <ElButton :tag="RouterLink" :to="{ name: 'admin-members' }">查看成员列表</ElButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { ElButton } from 'element-plus'

const roles = [
  { name: '管理员', description: '负责系统配置与团队管理。', members: 1 },
  { name: '编辑者', description: '负责日常内容维护与编辑。', members: 1 },
  { name: '观察者', description: '查看内容与业务数据。', members: 1 },
]
</script>

<style lang="scss" scoped></style>
