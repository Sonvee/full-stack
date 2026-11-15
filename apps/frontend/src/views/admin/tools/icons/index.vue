<template>
  <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
    <header class="flex shrink-0 items-center justify-between gap-4">
      <h1 class="text-xl font-semibold">图标库</h1>
      <p class="text-sm text-muted-foreground">显示 {{ filteredIconNames.length }} / {{ iconNames.length }} 个图标</p>
    </header>

    <el-input v-model="searchQuery" clearable placeholder="搜索图标名称" aria-label="搜索图标" class="shrink-0">
      <template #prefix>
        <i class="sv-icon-magnify" />
      </template>
    </el-input>

    <el-scrollbar class="min-h-0 flex-1" wrap-class="icons-scrollbar" mask>
      <ul v-if="filteredIconNames.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <li v-for="iconName in filteredIconNames" :key="iconName" class="min-w-0">
          <el-button
            class="h-full! w-full p-5! [&>span]:min-w-0 [&>span]:flex-col [&>span]:gap-3 [&>span]:whitespace-normal"
            :title="`点击复制 ${iconName}`"
            @click="copyIconName(iconName)"
          >
            <i :class="iconName" class="text-3xl" />
            <code class="break-all text-xs leading-5 text-muted-foreground">{{ iconName }}</code>
          </el-button>
        </li>
      </ul>
      <el-empty v-else description="未找到匹配的图标" />
    </el-scrollbar>
    <el-backtop target=".icons-scrollbar" title="返回顶部" />
  </section>
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { iconNames } from '@/utils/iconfont'
const searchQuery = shallowRef('')
const filteredIconNames = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  return iconNames.filter((iconName) => iconName.toLowerCase().includes(keyword))
})
const { copy, isSupported } = useClipboard()

async function copyIconName(iconName: string) {
  if (!isSupported.value) {
    ElMessage.error('当前浏览器不支持剪贴板复制')
    return
  }

  try {
    await copy(iconName)
    ElMessage.success(`已复制：${iconName}`)
  } catch {
    ElMessage.error('复制失败，请检查浏览器剪贴板权限')
  }
}
</script>

<style lang="scss" scoped></style>
