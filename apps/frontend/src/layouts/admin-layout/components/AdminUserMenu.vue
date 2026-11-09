<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg">
            <Avatar class="size-8 rounded-lg">
              <AvatarFallback class="rounded-lg">超</AvatarFallback>
            </Avatar>
            <div class="flex min-w-0 flex-1 flex-col text-left leading-tight">
              <span class="truncate font-medium">超级管理员</span>
              <span class="truncate text-xs">admin</span>
            </div>
            <i class="sv-icon-unfoldmore" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg [&_i]:size-4 [&_i]:shrink-0 [&_i]:text-base [&_i]:leading-none"
          :side="isMobile ? 'top' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="flex items-center gap-2 px-2 py-1.5">
            <Avatar class="size-8 rounded-lg">
              <AvatarFallback class="rounded-lg">超</AvatarFallback>
            </Avatar>
            <span class="flex min-w-0 flex-col gap-0.5 leading-tight">
              <span class="truncate font-semibold">超级管理员</span>
              <span class="truncate text-xs font-normal text-muted-foreground">admin</span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <RouterLink :to="{ name: 'admin-guide' }" @click="setOpenMobile(false)">
                <i class="sv-icon-informationoutline" />
                布局说明
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <RouterLink :to="{ name: 'home' }">
                <i class="sv-icon-home" />
                返回首页
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child variant="destructive">
            <RouterLink :to="{ name: 'login' }" @click="setOpenMobile(false)">
              <i class="sv-icon-logout" />
              退出登录
            </RouterLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const { isMobile, setOpenMobile } = useSidebar()
</script>

<style lang="scss" scoped></style>
