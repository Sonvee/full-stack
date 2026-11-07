<template>
  <SidebarProvider>
    <AdminSidebar />
    <SidebarInset class="min-w-0">
      <header class="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink as-child>
                <RouterLink :to="{ name: 'admin-dashboard' }">管理端</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <template v-for="(item, index) in breadcrumbs" :key="item.path">
              <BreadcrumbSeparator v-if="index > 0" />
              <BreadcrumbItem>
                <BreadcrumbPage v-if="index === breadcrumbs.length - 1">
                  {{ item.meta.title }}
                </BreadcrumbPage>
                <BreadcrumbLink v-else as-child>
                  <RouterLink :to="{ name: item.name }">{{ item.meta.title }}</RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </template>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div class="flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0">
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
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AdminSidebar from './components/AdminSidebar.vue'

const route = useRoute()
const breadcrumbs = computed(() =>
  route.matched.filter((record) => typeof record.meta.title === 'string'),
)
</script>

<style lang="scss" scoped></style>
