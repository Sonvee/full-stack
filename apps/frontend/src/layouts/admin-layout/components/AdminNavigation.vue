<template>
  <SidebarGroup>
    <SidebarGroupLabel>工作空间</SidebarGroupLabel>
    <SidebarMenu>
      <AdminNavigationItem v-for="item in adminRoutes" :key="item.path" :item="item" />
    </SidebarMenu>
  </SidebarGroup>
  <SidebarGroup>
    <SidebarGroupLabel>开发资源</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton as-child>
          <a href="https://shadcn-vue.com/blocks/sidebar" target="_blank" rel="noopener noreferrer">
            <i class="sv-icon-menu-management" aria-hidden="true" />
            <span>shadcn-vue 布局</span>
            <span class="sr-only">（新窗口打开）</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child>
          <a
            href="https://cn.vuejs.org/guide/introduction.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="sv-icon-bookopen" aria-hidden="true" />
            <span>Vue 文档</span>
            <span class="sr-only">（新窗口打开）</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>

<script lang="ts" setup>
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { adminRoutes } from '@/router/admin-routes'
import AdminNavigationItem from './AdminNavigationItem.vue'
</script>

<style lang="scss" scoped></style>
