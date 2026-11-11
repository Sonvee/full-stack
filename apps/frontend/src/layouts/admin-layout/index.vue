<template>
  <SidebarProvider :class="cn(fixedHeight && 'h-svh min-h-0 overflow-hidden')">
    <AdminSidebar />
    <SidebarInset :class="cn('min-w-0', fixedHeight && 'min-h-0 overflow-hidden')">
      <header class="flex h-16 shrink-0 items-center gap-2 px-4">
        <AdminSidebarTrigger class="-ml-1" />
        <el-divider direction="vertical" class="ml-0! h-4!" />
        <el-breadcrumb class="flex min-w-0 overflow-hidden whitespace-nowrap">
          <el-breadcrumb-item :to="{ name: 'admin-dashboard' }" class="hidden! shrink-0 md:inline-flex!">
            管理端
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbs"
            :key="item.path"
            :to="index === breadcrumbs.length - 1 ? undefined : { name: item.name }"
            class="min-w-0 shrink-0 last:shrink [&_.el-breadcrumb__inner]:truncate"
          >
            {{ item.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
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
import { RouterView, useRoute } from 'vue-router'
import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminSidebarTrigger from './components/AdminSidebarTrigger.vue'
import AdminAppearanceTools from './components/AdminAppearanceTools.vue'

const route = useRoute()
const fixedHeight = computed(() => route.meta.fixedHeight === true)
const breadcrumbs = computed(() =>
  route.matched.filter((record) => typeof record.meta.title === 'string'),
)
</script>

<style lang="scss" scoped></style>
