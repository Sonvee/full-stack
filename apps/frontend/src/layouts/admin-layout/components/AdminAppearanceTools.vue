<template>
  <div class="ml-auto flex shrink-0 items-center gap-2">
    <AdminPageSearch />

    <el-divider direction="vertical" class="mx-1! h-4!" />

    <el-dropdown trigger="click" placement="bottom-end">
      <el-button text circle :title="`主题色：${selectedColor.label}`">
        <i class="sv-icon-palette text-lg" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <li class="px-4 py-1 text-sm font-semibold">主题色</li>
          <el-dropdown-item
            v-for="(item, index) in themeColors"
            :key="item.value"
            :divided="index === 0"
            @click="themeColor = item.value"
          >
            <i class="sv-icon-check mr-2" :class="{ invisible: themeColor !== item.value }" />
            <span class="mr-2 size-3 shrink-0 rounded-full" :style="{ backgroundColor: item.swatch }" />
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-divider direction="vertical" class="mx-1! h-4!" />

    <el-dropdown trigger="click" placement="bottom-end">
      <el-button text circle :title="`显示模式：${selectedMode.label}`">
        <i :class="selectedMode.icon" class="text-lg" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <li class="px-4 py-1 text-sm font-semibold">显示模式</li>
          <el-dropdown-item
            v-for="(item, index) in appearanceModes"
            :key="item.value"
            :divided="index === 0"
            @click="mode = item.value"
          >
            <i class="sv-icon-check mr-2" :class="{ invisible: mode !== item.value }" />
            <i class="mr-2" :class="item.icon" />
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { appearanceModes, themeColors, useAppearance } from '@/composables/use-appearance'
import AdminPageSearch from './AdminPageSearch.vue'

const { themeColor, mode, selectedColor, selectedMode } = useAppearance()
</script>

<style lang="scss" scoped></style>
