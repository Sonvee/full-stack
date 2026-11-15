<template>
  <el-config-provider :locale="zhCn" :size="currentSize.value">
    <RouterView />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import { useAppLoading } from '@/composables/use-app-loading'
import { useAppearance } from '@/composables/use-appearance'

const { currentSize } = useAppearance()
useAppLoading()
</script>

<style lang="scss" scoped></style>
