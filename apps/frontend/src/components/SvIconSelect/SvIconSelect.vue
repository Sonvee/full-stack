<template>
  <el-select-v2 v-model="model" :options="options" :placeholder="props.placeholder" filterable value-on-clear="">
    <template #prefix>
      <i :class="model || 'sv-icon-my-icons'" />
    </template>
    <template #default="{ item }">
      <span class="flex min-w-0 items-center gap-2">
        <i :class="item.value" class="shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </span>
    </template>
  </el-select-v2>
</template>

<script lang="ts" setup>
import { ElSelectV2 } from 'element-plus'
import { iconNames } from '@/utils/iconfont'

const props = withDefaults(defineProps<{ placeholder?: string }>(), {
  placeholder: '请选择图标'
})

/** 选中值为项目图标类名，可直接绑定到图标的 class。 */
const model = defineModel<string>({ default: '' })

/** 使用组件库的虚拟列表展示完整图标库，按类名搜索。 */
const options = iconNames.map((iconName) => ({ label: iconName, value: iconName }))
</script>

<style lang="scss" scoped></style>
