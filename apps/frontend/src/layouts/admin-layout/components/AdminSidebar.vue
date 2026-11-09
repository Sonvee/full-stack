<template>
  <Sidebar
    variant="inset"
    collapsible="offcanvas"
    class="[&_i]:size-4 [&_i]:shrink-0 [&_i]:text-base [&_i]:leading-none"
  >
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child size="lg">
            <RouterLink :to="{ name: 'admin-dashboard' }" @click="setOpenMobile(false)">
              <div
                class="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <i class="sv-icon-logo" />
              </div>
              <div class="flex min-w-0 flex-1 flex-col text-left leading-tight">
                <span class="truncate font-medium">Full Stack</span>
                <span class="truncate text-xs">管理控制台</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <AdminNavigation />
      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child size="sm">
                <RouterLink :to="{ name: 'home' }">
                  <i class="sv-icon-home" />
                  <span>返回首页</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <AdminUserMenu />
    </SidebarFooter>
  </Sidebar>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import AdminNavigation from './AdminNavigation.vue'
import AdminUserMenu from './AdminUserMenu.vue'

const route = useRoute()
const { setOpenMobile } = useSidebar()

watch(
  () => route.fullPath,
  () => setOpenMobile(false),
)
</script>

<style lang="scss" scoped></style>
