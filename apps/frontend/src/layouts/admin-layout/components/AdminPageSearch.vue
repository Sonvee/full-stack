<template>
  <DialogRoot v-model:open="isOpen">
    <Button
      variant="outline"
      size="sm"
      class="hidden w-40 justify-between gap-2 rounded-lg text-muted-foreground sm:flex"
      aria-label="搜索页面"
      @click="openSearch"
    >
      <span class="flex min-w-0 items-center gap-2">
        <i class="sv-icon-magnify shrink-0" aria-hidden="true" />
        <span class="truncate">搜索页面</span>
      </span>
      <kbd class="shrink-0 rounded border bg-background px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
    </Button>
    <Button
      variant="ghost"
      size="icon-sm"
      class="rounded-lg sm:hidden"
      aria-label="搜索页面"
      title="搜索页面"
      @click="openSearch"
    >
      <i class="sv-icon-magnify" aria-hidden="true" />
    </Button>

    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]" />
      <DialogContent
        class="fixed left-1/2 top-[12vh] z-50 grid w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 gap-0 overflow-hidden rounded-xl border bg-popover p-0 text-popover-foreground shadow-2xl"
      >
        <DialogTitle class="sr-only">搜索页面</DialogTitle>
        <DialogDescription class="sr-only">输入页面名称或路径来筛选页面。</DialogDescription>

        <div class="flex h-12 items-center gap-3 border-b px-4">
          <i class="sv-icon-magnify shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            v-model="query"
            type="search"
            role="combobox"
            aria-label="搜索页面"
            aria-autocomplete="list"
            aria-controls="admin-page-search-results"
            :aria-expanded="isOpen"
            :aria-activedescendant="
              filteredPages[activeIndex] ? `admin-page-search-result-${activeIndex}` : undefined
            "
            autofocus
            placeholder="搜索页面"
            class="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            @keydown="handleSearchKeydown"
          />
          <kbd class="shrink-0 rounded border bg-muted px-1.5 py-0.5 text-[10px]">ESC</kbd>
        </div>

        <div class="max-h-[min(60vh,24rem)] overflow-y-auto p-2">
          <p class="px-2 py-1.5 text-xs font-medium text-muted-foreground">页面</p>
          <div
            v-if="filteredPages.length"
            id="admin-page-search-results"
            role="listbox"
            aria-label="管理页面"
          >
            <button
              v-for="(page, index) in filteredPages"
              :id="`admin-page-search-result-${index}`"
              :key="page.name"
              type="button"
              role="option"
              :aria-selected="activeIndex === index"
              class="flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
              :class="{ 'bg-accent text-accent-foreground': activeIndex === index }"
              @mouseenter="activeIndex = index"
              @click="navigateTo(page.name)"
            >
              <i class="sv-icon-arrowright shrink-0 text-muted-foreground" aria-hidden="true" />
              <span class="min-w-0 flex-1 truncate">{{ page.title }}</span>
              <span class="hidden shrink-0 truncate text-xs text-muted-foreground sm:block">
                {{ page.path }}
              </span>
            </button>
          </div>
          <p v-else class="px-2 py-8 text-center text-sm text-muted-foreground" role="status">
            没有找到匹配的页面
          </p>
        </div>

        <div
          class="flex items-center gap-4 border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground"
        >
          <span><kbd class="rounded border bg-background px-1">↑↓</kbd> 选择</span>
          <span><kbd class="rounded border bg-background px-1">↵</kbd> 打开</span>
          <span><kbd class="rounded border bg-background px-1">Esc</kbd> 关闭</span>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

const router = useRouter()
const isOpen = shallowRef(false)
const query = shallowRef('')
const activeIndex = shallowRef(0)

const pages = router.getRoutes().flatMap((route) => {
  if (
    typeof route.name !== 'string' ||
    !route.name.startsWith('admin-') ||
    route.redirect ||
    typeof route.meta.title !== 'string'
  ) {
    return []
  }

  return [{ name: route.name, title: route.meta.title, path: route.path }]
})

const filteredPages = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return pages.filter((page) => `${page.title} ${page.path}`.toLocaleLowerCase().includes(keyword))
})

watch(query, () => {
  activeIndex.value = 0
})

function openSearch() {
  query.value = ''
  activeIndex.value = 0
  isOpen.value = true
}

function navigateTo(name: string) {
  isOpen.value = false
  void router.push({ name })
}

function handleSearchKeydown(event: KeyboardEvent) {
  if (!filteredPages.value.length) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % filteredPages.value.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value =
      (activeIndex.value - 1 + filteredPages.value.length) % filteredPages.value.length
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const page = filteredPages.value[activeIndex.value]
    if (page) navigateTo(page.name)
  }
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleGlobalKeydown))
</script>

<style lang="scss" scoped></style>
