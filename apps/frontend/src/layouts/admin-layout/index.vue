<template>
  <SidebarProvider :class="cn(fixedHeight && 'h-svh min-h-0 overflow-hidden')">
    <AdminSidebar />
    <SidebarInset :class="cn('min-w-0', fixedHeight && 'min-h-0 overflow-hidden')">
      <header class="flex h-16 shrink-0 items-center gap-2 px-4">
        <AdminSidebarTrigger class="-ml-1" />
        <el-divider direction="vertical" class="hidden! ml-0! h-4! md:inline-block!" />
        <el-breadcrumb class="hidden! min-w-0 overflow-hidden whitespace-nowrap md:flex!">
          <el-breadcrumb-item :to="{ name: 'admin-dashboard' }" class="hidden! shrink-0 md:inline-flex!"> 管理端 </el-breadcrumb-item>
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
      <div :class="cn('flex min-w-0 flex-1 flex-col gap-4 p-4 pt-0', fixedHeight && 'min-h-0 overflow-hidden')">
        <div :class="cn('relative flex min-w-0 flex-1 flex-col', fixedHeight && 'min-h-0')">
          <RouterView v-slot="{ Component, route: currentRoute }">
            <!-- 页面统一过渡，按路由名称匹配需要缓存的页面组件。 -->
            <Transition name="route-fade">
              <KeepAlive :include="keepAliveList">
                <component :is="Component" :key="currentRoute.path" />
              </KeepAlive>
            </Transition>
          </RouterView>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { cn } from 'cn'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminSidebarTrigger from './components/AdminSidebarTrigger.vue'
import AdminAppearanceTools from './components/AdminAppearanceTools.vue'

const route = useRoute()
const router = useRouter()
const fixedHeight = computed(() => route.meta.fixedHeight !== false)
const breadcrumbs = computed(() => route.matched.filter((record) => typeof record.meta.title === 'string'))

/** 收集启用缓存的路由名称，组件名称由全局路由守卫统一设置。 */
const keepAliveList = router
  .getRoutes()
  .filter((record) => record.meta.keepAlive === true)
  .map((record) => record.name)
  .filter((name) => typeof name === 'string')
</script>

<style lang="scss" scoped>
.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 180ms ease-out;
}

// 离场页面脱离布局，使进场页面始终占满内容区。
.route-fade-leave-active {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .route-fade-enter-active,
  .route-fade-leave-active {
    transition: none;
  }
}
</style>
