<template>
  <el-button text circle size="small" title="展开或收起侧栏" @click="toggleSidebar">
    <i class="sv-icon-fold" />
  </el-button>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { useSidebar } from '@/components/ui/sidebar'

const { toggleSidebar } = useSidebar()
</script>

<style lang="scss" scoped></style>
