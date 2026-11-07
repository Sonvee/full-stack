<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg" aria-label="打开管理端菜单">
            <Avatar class="size-8 rounded-lg">
              <AvatarFallback class="rounded-lg">AD</AvatarFallback>
            </Avatar>
            <div class="flex min-w-0 flex-1 flex-col text-left leading-tight">
              <span class="truncate font-medium">管理端</span>
              <span class="truncate text-xs">布局预览</span>
            </div>
            <i class="sv-icon-unfoldmore" aria-hidden="true" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg [&_i]:size-4 [&_i]:shrink-0 [&_i]:text-base [&_i]:leading-none"
          :side="isMobile ? 'top' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>管理控制台</DropdownMenuLabel>
            <DropdownMenuItem as-child>
              <RouterLink :to="{ name: 'admin-guide' }" @click="setOpenMobile(false)">
                <i class="sv-icon-informationoutline" aria-hidden="true" />
                布局说明
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <RouterLink :to="{ name: 'home' }">
                <i class="sv-icon-home" aria-hidden="true" />
                返回首页
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
