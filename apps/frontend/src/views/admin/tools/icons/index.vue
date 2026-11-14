<template>
  <section class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
    <header class="flex shrink-0 items-center justify-between gap-4">
      <h1 class="text-xl font-semibold">图标库</h1>
      <p class="text-sm text-muted-foreground">共 {{ iconNames.length }} 个图标</p>
    </header>

    <el-scrollbar class="min-h-0 flex-1">
      <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <li v-for="iconName in iconNames" :key="iconName" class="min-w-0">
          <el-card
            shadow="never"
            class="h-full"
            body-class="flex h-full flex-col items-center gap-3 text-center"
          >
            <i :class="iconName" class="text-3xl" />
            <code class="select-all break-all text-xs leading-5 text-muted-foreground">{{ iconName }}</code>
          </el-card>
        </li>
      </ul>
    </el-scrollbar>
  </section>
</template>

<script lang="ts" setup>
import iconfontCss from '@/assets/iconfont/iconfont.css?raw'

/** 直接读取字体样式中的类名，更新 iconfont 时同步图标清单。 */
const iconNames = (iconfontCss.match(/\.sv-icon-[\w-]+(?=:before)/g) ?? []).map((name) => name.slice(1))
</script>

<style lang="scss" scoped></style>
