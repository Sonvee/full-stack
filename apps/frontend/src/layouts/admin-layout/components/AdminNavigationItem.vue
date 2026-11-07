<template>
  <Collapsible v-if="item.children?.length" v-model:open="open" as-child>
    <component :is="containerComponent">
      <CollapsibleTrigger as-child>
        <component
          :is="buttonComponent"
          as="button"
          type="button"
          :is-active="isActive"
          class="group/menu-toggle w-full"
        >
          <i :class="item.meta?.icon" aria-hidden="true" />
          <span>{{ item.meta?.title }}</span>
          <i
            class="sv-icon-chevronright ml-auto transition-transform group-data-[state=open]/menu-toggle:rotate-90 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </component>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          <AdminNavigationItem
            v-for="child in item.children"
            :key="child.path"
            :item="child"
            nested
          />
        </SidebarMenuSub>
      </CollapsibleContent>
    </component>
  </Collapsible>
  <component :is="containerComponent" v-else>
    <component :is="buttonComponent" as-child :is-active="isActive">
      <RouterLink :to="{ name: item.name }" @click="setOpenMobile(false)">
        <i :class="item.meta?.icon" aria-hidden="true" />
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
