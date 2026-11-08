<template>
  <SidebarProvider :class="cn(fixedHeight && 'h-svh min-h-0 overflow-hidden')">
    <AdminSidebar />
    <SidebarInset :class="cn('min-w-0', fixedHeight && 'min-h-0 overflow-hidden')">
      <header class="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb class="min-w-0 overflow-hidden">
          <BreadcrumbList class="flex-nowrap">
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink as-child>
                <RouterLink :to="{ name: 'admin-dashboard' }">管理端</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <template v-for="(item, index) in breadcrumbs" :key="item.path">
              <BreadcrumbSeparator v-if="index > 0" />
              <BreadcrumbItem class="min-w-0 shrink-0 last:shrink">
                <BreadcrumbPage v-if="index === breadcrumbs.length - 1" class="truncate">
                  {{ item.meta.title }}
                </BreadcrumbPage>
                <BreadcrumbLink v-else as-child>
                  <RouterLink :to="{ name: item.name }">{{ item.meta.title }}</RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </template>
          </BreadcrumbList>
        </Breadcrumb>
        <AdminAppearanceTools />
      </header>
      <div
        :class="
          cn(
            'flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0',
            fixedHeight && 'min-h-0 overflow-hidden',
          )
        "
      >
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminAppearanceTools from './components/AdminAppearanceTools.vue'

const route = useRoute()
const fixedHeight = computed(() => route.meta.fixedHeight === true)
const breadcrumbs = computed(() =>
  route.matched.filter((record) => typeof record.meta.title === 'string'),
)
</script>

<style lang="scss" scoped></style>
