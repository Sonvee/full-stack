import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { createSharedComposable, useColorMode } from '@vueuse/core'
import { useSystemSettingStore } from '@/stores/system-setting'

export const themeColors = [
  { value: 'blue', label: '极客蓝', swatch: 'var(--color-blue-600)' },
  { value: 'red', label: '玫瑰红', swatch: 'var(--color-red-600)' },
  { value: 'green', label: '竹林绿', swatch: 'var(--color-green-700)' },
  { value: 'orange', label: '琥珀橙', swatch: 'var(--color-orange-700)' },
  { value: 'violet', label: '薰衣紫', swatch: 'var(--color-violet-600)' },
  { value: 'pink', label: '樱花粉', swatch: 'var(--color-pink-600)' }
] as const

export const radiusModes = [
  { value: 'square', label: '方正' },
  { value: 'rounded', label: '圆角' },
  { value: 'capsule', label: '胶囊' }
] as const

export const sizeModes = [
  { value: 'small', label: '较小' },
  { value: 'default', label: '适中' },
  { value: 'large', label: '较大' }
] as const

export const skinModes = [
  { value: 'light', label: '白昼', icon: 'sv-icon-daytime-mode' },
  { value: 'dark', label: '暗夜', icon: 'sv-icon-night-mode' },
  { value: 'auto', label: '系统', icon: 'sv-icon-themelightdark' }
] as const

/** 在应用内共享外观偏好，并将系统设置中的偏好同步到根节点。 */
export const useAppearance = createSharedComposable(() => {
  const { appearance } = storeToRefs(useSystemSettingStore())

  useColorMode({
    storageRef: computed({
      get: () => appearance.value.skinMode,
      set: (value) => {
        appearance.value.skinMode = value
      }
    })
  })
  const currentSkin = computed(() => skinModes.find((mode) => mode.value === appearance.value.skinMode) ?? skinModes[2])
  const currentThemeColor = computed(() => themeColors.find((color) => color.value === appearance.value.themeColor) ?? themeColors[0])
  const currentRadius = computed(() => radiusModes.find((mode) => mode.value === appearance.value.radiusMode) ?? radiusModes[1])
  const currentSize = computed(() => sizeModes.find((size) => size.value === appearance.value.sizeMode) ?? sizeModes[1])

  watch(
    currentThemeColor,
    (color) => {
      document.documentElement.dataset.theme = color.value
    },
    { immediate: true }
  )

  watch(
    currentRadius,
    (radius) => {
      document.documentElement.dataset.radius = radius.value
    },
    { immediate: true }
  )

  return {
    appearance,
    currentThemeColor,
    currentRadius,
    currentSize,
    currentSkin
  }
})
