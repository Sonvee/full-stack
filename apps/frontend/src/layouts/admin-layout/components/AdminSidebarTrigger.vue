<template>
  <el-button text circle title="展开或收起侧栏" @click="toggleSidebar">
    <i class="text-lg" :class="isOpen ? 'sv-icon-fold' : 'sv-icon-expand'" />
  </el-button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useSidebar } from '@/components/ui/sidebar'

const { isMobile, open, openMobile, toggleSidebar } = useSidebar()
const isOpen = computed(() => (isMobile.value ? openMobile.value : open.value))
</script>

<style lang="scss" scoped></style>
