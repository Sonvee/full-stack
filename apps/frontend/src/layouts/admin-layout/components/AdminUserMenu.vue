<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <el-dropdown trigger="click" :placement="isMobile ? 'top-end' : 'right-end'" class="w-full">
        <SidebarMenuButton size="lg">
          <el-avatar :size="32" shape="square">超</el-avatar>
          <div class="flex min-w-0 flex-1 flex-col text-left leading-tight">
            <span class="truncate font-medium">超级管理员</span>
            <span class="truncate text-xs">admin</span>
          </div>
          <i class="sv-icon-unfoldmore" />
        </SidebarMenuButton>
        <template #dropdown>
          <el-dropdown-menu>
            <li class="flex items-center gap-2 px-4 py-2">
              <el-avatar :size="32" shape="square">超</el-avatar>
              <span class="flex min-w-0 flex-col gap-0.5 leading-tight">
                <span class="truncate font-semibold">超级管理员</span>
                <span class="truncate text-xs font-normal text-muted-foreground">admin</span>
              </span>
            </li>
            <el-dropdown-item divided @click="setOpenMobile(false); router.push({ name: 'admin-guide' })">
              <i class="sv-icon-informationoutline mr-2" />
              布局说明
            </el-dropdown-item>
            <el-dropdown-item @click="router.push({ name: 'home' })">
              <i class="sv-icon-home mr-2" />
              返回首页
            </el-dropdown-item>
            <el-dropdown-item divided @click="setOpenMobile(false); router.push({ name: 'login' })">
              <span class="text-destructive"><i class="sv-icon-logout mr-2" />退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const router = useRouter()
const { isMobile, setOpenMobile } = useSidebar()
</script>

<style lang="scss" scoped></style>
