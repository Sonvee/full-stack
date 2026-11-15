<template>
  <div class="ml-auto flex shrink-0 items-center gap-2">
    <AdminPageSearch />

    <el-divider direction="vertical" class="mx-1! h-4!" />

    <el-dropdown trigger="click" placement="bottom-end">
      <el-button text circle :title="`尺寸模式：${currentSize.label}`">
        <i class="sv-icon-formatsize text-lg" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <li class="px-4 py-1 text-sm font-semibold">尺寸模式</li>
          <el-dropdown-item
            v-for="(item, index) in sizeModes"
            :key="item.value"
            :divided="index === 0"
            @click="appearance.sizeMode = item.value"
          >
            <i class="sv-icon-check mr-2" :class="{ invisible: appearance.sizeMode !== item.value }" />
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-divider direction="vertical" class="mx-1! h-4!" />

    <el-dropdown trigger="click" placement="bottom-end">
      <el-button text circle :title="`圆角模式：${currentRadius.label}`">
        <i class="sv-icon-borderstyle text-lg" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <li class="px-4 py-1 text-sm font-semibold">圆角模式</li>
          <el-dropdown-item
            v-for="(item, index) in radiusModes"
            :key="item.value"
            :divided="index === 0"
            @click="appearance.radiusMode = item.value"
          >
            <i class="sv-icon-check mr-2" :class="{ invisible: appearance.radiusMode !== item.value }" />
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-divider direction="vertical" class="mx-1! h-4!" />

    <el-dropdown trigger="click" placement="bottom-end">
      <el-button text circle :title="`主题色：${currentThemeColor.label}`">
        <i class="sv-icon-palette text-lg" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <li class="px-4 py-1 text-sm font-semibold">主题色</li>
          <el-dropdown-item
            v-for="(item, index) in themeColors"
            :key="item.value"
            :divided="index === 0"
            @click="appearance.themeColor = item.value"
          >
            <i class="sv-icon-check mr-2" :class="{ invisible: appearance.themeColor !== item.value }" />
            <span class="mr-2 size-3 shrink-0 rounded-full" :style="{ backgroundColor: item.swatch }" />
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-divider direction="vertical" class="mx-1! h-4!" />

    <el-dropdown trigger="click" placement="bottom-end">
      <el-button text circle :title="`皮肤外观：${currentSkin.label}`">
        <i :class="currentSkin.icon" class="text-lg" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <li class="px-4 py-1 text-sm font-semibold">皮肤外观</li>
          <el-dropdown-item
            v-for="(item, index) in skinModes"
            :key="item.value"
            :divided="index === 0"
            @click="appearance.skinMode = item.value"
          >
            <i class="sv-icon-check mr-2" :class="{ invisible: appearance.skinMode !== item.value }" />
            <i class="mr-2" :class="item.icon" />
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { skinModes, sizeModes, radiusModes, themeColors, useAppearance } from '@/composables/use-appearance'
import AdminPageSearch from './AdminPageSearch.vue'

const { appearance, currentThemeColor, currentRadius, currentSize, currentSkin } = useAppearance()
</script>

<style lang="scss" scoped></style>
