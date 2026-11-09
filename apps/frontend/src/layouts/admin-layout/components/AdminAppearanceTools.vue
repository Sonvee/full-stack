<template>
  <div class="ml-auto flex shrink-0 items-center gap-2">
    <AdminPageSearch />

    <Separator orientation="vertical" class="mx-1 data-[orientation=vertical]:h-4" />

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="icon-sm"
          class="rounded-lg"
          :aria-label="`主题色：${selectedColor.label}`"
          :title="`主题色：${selectedColor.label}`"
        >
          <i class="sv-icon-palette" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="min-w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>主题色</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup v-model="themeColor">
            <DropdownMenuRadioItem
              v-for="color in themeColors"
              :key="color.value"
              :value="color.value"
            >
              <span
                class="size-3 shrink-0 rounded-full"
                :style="{ backgroundColor: color.swatch }"
              />
              {{ color.label }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <Separator orientation="vertical" class="mx-1 data-[orientation=vertical]:h-4" />

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="icon-sm"
          class="rounded-lg"
          :aria-label="`显示模式：${selectedMode.label}`"
          :title="`显示模式：${selectedMode.label}`"
        >
          <i :class="selectedMode.icon" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="min-w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>显示模式</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup v-model="mode">
            <DropdownMenuRadioItem
              v-for="option in appearanceModes"
              :key="option.value"
              :value="option.value"
            >
              <i :class="option.icon" />
              {{ option.label }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { appearanceModes, themeColors, useAppearance } from '@/composables/use-appearance'
import AdminPageSearch from './AdminPageSearch.vue'

const { themeColor, mode, selectedColor, selectedMode } = useAppearance()
</script>

<style lang="scss" scoped></style>
