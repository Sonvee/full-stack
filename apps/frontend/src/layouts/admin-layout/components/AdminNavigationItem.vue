<template>
  <Collapsible v-if="visibleChildren.length" v-model:open="open" as-child>
    <component :is="containerComponent">
      <CollapsibleTrigger as-child>
        <component
          :is="buttonComponent"
          as="button"
          type="button"
          :is-active="isActive"
          class="group/menu-toggle w-full translate-x-0"
        >
          <i :class="item.meta?.icon" />
          <span>{{ item.meta?.title }}</span>
          <i
            class="sv-icon-chevronright ml-auto transition-transform group-data-[state=open]/menu-toggle:rotate-90 motion-reduce:transition-none"
          />
        </component>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub class="mr-0 translate-x-0 pr-0">
          <AdminNavigationItem
            v-for="child in visibleChildren"
            :key="child.path"
            :item="child"
            nested
          />
        </SidebarMenuSub>
      </CollapsibleContent>
    </component>
  </Collapsible>
  <component :is="containerComponent" v-else>
    <component :is="buttonComponent" as-child :is-active="isActive" class="w-full translate-x-0">
      <RouterLink :to="{ name: item.name }" @click="setOpenMobile(false)">
        <i :class="item.meta?.icon" />
        <span>{{ item.meta?.title }}</span>
      </RouterLink>
    </component>
  </component>
</template>

<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'

const { item, nested = false } = defineProps<{ item: RouteRecordRaw; nested?: boolean }>()
const route = useRoute()
const { setOpenMobile } = useSidebar()
const open = shallowRef(false)
/** 过滤后再判断是否展开，只有隐藏子路由的菜单仍可直接点击。 */
const visibleChildren = computed(() => item.children?.filter((child) => child.meta?.hide !== true) ?? [])
const isActive = computed(() => route.matched.some((record) => record.name === item.name))
const containerComponent = computed(() => (nested ? SidebarMenuSubItem : SidebarMenuItem))
const buttonComponent = computed(() => (nested ? SidebarMenuSubButton : SidebarMenuButton))

watch(
  () => route.fullPath,
  () => {
    if (isActive.value) open.value = true
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped></style>
