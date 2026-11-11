<template>
  <el-button
    class="hidden! w-42 sm:inline-flex! [&>span]:w-full [&>span]:justify-between [&>span]:gap-2"
    @click="openSearch"
  >
    <span class="flex min-w-0 items-center gap-2">
      <i class="sv-icon-magnify shrink-0" />
      <span class="truncate">搜索页面</span>
    </span>
    <Kbd class="shrink-0">Ctrl + K</Kbd>
  </el-button>
  <el-button
    text
    circle
    class="sm:hidden!"
    title="搜索页面"
    @click="openSearch"
  >
    <i class="sv-icon-magnify" />
  </el-button>

  <el-dialog
    v-model="isOpen"
    title="搜索页面"
    width="min(36rem, calc(100vw - 2rem))"
    align-center
    append-to-body
    destroy-on-close
  >
    <el-input
      v-model="query"
      type="search"
      autofocus
      placeholder="搜索页面"
      @keydown="handleSearchKeydown"
    >
      <template #prefix>
        <i class="sv-icon-magnify" />
      </template>
    </el-input>

    <div class="max-h-[min(60vh,24rem)] overflow-y-auto p-2">
      <p class="px-2 py-1.5 text-xs font-medium text-muted-foreground">页面</p>
      <div v-if="filteredPages.length">
        <el-button
          v-for="(page, index) in filteredPages"
          :key="page.name"
          text
          :bg="activeIndex === index"
          class="ml-0! h-9! w-full [&>span]:w-full [&>span]:gap-2"
          @mouseenter="activeIndex = index"
          @click="navigateTo(page.name)"
        >
          <i :class="[page.icon, 'shrink-0 text-muted-foreground']" />
          <span class="min-w-0 flex-1 truncate">{{ page.title }}</span>
          <span class="hidden shrink-0 truncate text-xs text-muted-foreground sm:block">
            {{ page.path }}
          </span>
        </el-button>
      </div>
      <p v-else class="px-2 py-8 text-center text-sm text-muted-foreground">
        没有找到匹配的页面
      </p>
    </div>

    <div
      class="flex items-center gap-4 border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground"
    >
      <span><Kbd>↑↓</Kbd> 选择</span>
      <span><Kbd>↵</Kbd> 打开</span>
      <span><Kbd>Esc</Kbd> 关闭</span>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElDialog, ElInput } from 'element-plus'
import { Kbd } from '@/components/ui/kbd'

const router = useRouter()
const isOpen = shallowRef(false)
const query = shallowRef('')
const activeIndex = shallowRef(0)

const pages = router.getRoutes().flatMap((route) => {
  if (
    typeof route.name !== 'string' ||
    !route.name.startsWith('admin-') ||
    route.redirect ||
    typeof route.meta.title !== 'string' ||
    typeof route.meta.icon !== 'string'
  ) {
    return []
  }

  return [{ name: route.name, title: route.meta.title, path: route.path, icon: route.meta.icon }]
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

function handleSearchKeydown(event: Event) {
  if (!(event instanceof KeyboardEvent) || !filteredPages.value.length) {
    return
  }

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
    if (page) {
      navigateTo(page.name)
    }
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
