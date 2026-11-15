import { computed, watch } from 'vue'
import { createSharedComposable, useColorMode, useStorage } from '@vueuse/core'

export const themeColors = [
  { value: 'blue', label: '极客蓝', swatch: 'var(--color-blue-600)' },
  { value: 'red', label: '玫瑰红', swatch: 'var(--color-red-600)' },
  { value: 'green', label: '竹林绿', swatch: 'var(--color-green-700)' },
  { value: 'orange', label: '琥珀橙', swatch: 'var(--color-orange-700)' },
  { value: 'violet', label: '薰衣紫', swatch: 'var(--color-violet-600)' },
  { value: 'pink', label: '樱花粉', swatch: 'var(--color-pink-600)' },
] as const

export const radiusModes = [
  { value: 'square', label: '方正' },
  { value: 'rounded', label: '圆角' },
  { value: 'capsule', label: '胶囊' },
] as const

export const appearanceModes = [
  { value: 'light', label: '白昼', icon: 'sv-icon-daytime-mode' },
  { value: 'dark', label: '暗夜', icon: 'sv-icon-night-mode' },
  { value: 'auto', label: '系统', icon: 'sv-icon-themelightdark' },
] as const

/** 在应用内共享外观偏好，通过 VueUse 保存选择并同步根节点主题。 */
export const useAppearance = createSharedComposable(() => {
  const colorMode = useColorMode({
    initialValue: 'auto',
    storageKey: 'color-mode',
  })
  const themeColor = useStorage('theme-color', 'blue')
  const radiusMode = useStorage('radius-mode', 'rounded')
  const selectedColor = computed(
    () => themeColors.find((color) => color.value === themeColor.value) ?? themeColors[0],
  )
  const selectedMode = computed(
    () =>
      appearanceModes.find((mode) => mode.value === colorMode.store.value) ?? appearanceModes[2],
  )
  const selectedRadiusMode = computed(
    () => radiusModes.find((mode) => mode.value === radiusMode.value) ?? radiusModes[1],
  )

  watch(
    selectedColor,
    (color) => {
      document.documentElement.dataset.theme = color.value
    },
    { immediate: true },
  )

  watch(
    selectedRadiusMode,
    (mode) => {
      document.documentElement.dataset.radius = mode.value
    },
    { immediate: true },
  )

  return {
    themeColor,
    radiusMode,
    mode: colorMode.store,
    selectedColor,
    selectedRadiusMode,
    selectedMode,
  }
})
