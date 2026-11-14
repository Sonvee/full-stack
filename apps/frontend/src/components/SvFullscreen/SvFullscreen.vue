<template>
  <el-button
    text
    circle
    :title="isFullscreen ? '退出全屏' : '全屏'"
    :disabled="pending || (props.f11 ? !isSupported : !props.container)"
    @click="toggle"
  >
    <i :class="isFullscreen ? 'sv-icon-fullscreenexit' : 'sv-icon-fullscreen'" class="text-lg"/>
  </el-button>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { onKeyStroke, useFullscreen } from '@vueuse/core'
import { ElMessage, useZIndex } from 'element-plus'
import type { SvFullscreenProps } from './types'

const props = withDefaults(defineProps<SvFullscreenProps>(), {
  f11: false,
})
/** 窗口内全屏偏好，可由调用方持久化；卸载清理时保留。 */
const full = defineModel<boolean>('full', { default: false })

// 对整个文档请求原生全屏，让挂在 body 下的弹层仍处于全屏元素内。
const { isSupported, isFullscreen: isNativeFullscreen, toggle: toggleNative, exit: exitNative } = useFullscreen()
const { nextZIndex } = useZIndex()
const isWindowFullscreen = shallowRef(false)
const pending = shallowRef(false)
const isFullscreen = computed(() => props.f11 ? isNativeFullscreen.value : isWindowFullscreen.value)
let restoreContainer: (() => void) | undefined
let ownsNativeFullscreen = false
let nativeCancelled = false

/** 恢复窗口内铺满前的 DOM 位置和层级。 */
function exitWindow() {
  restoreContainer?.()
  restoreContainer = undefined
  isWindowFullscreen.value = false
}

/** 将容器移到 body，避免父级的 transform 或 overflow 限制铺满范围。 */
function enterWindow() {
  const container = props.container
  if (!container) return
  if (container === document.body || container === document.documentElement) return
  if (container.classList.contains('sv-fullscreen-container')) return

  const placeholder = document.createComment('sv-fullscreen')
  const zIndex = container.style.getPropertyValue('--sv-fullscreen-z-index')
  const priority = container.style.getPropertyPriority('--sv-fullscreen-z-index')
  container.before(placeholder)
  document.body.append(container)
  container.style.setProperty('--sv-fullscreen-z-index', String(nextZIndex()))
  container.classList.add('sv-fullscreen-container')

  restoreContainer = () => {
    container.classList.remove('sv-fullscreen-container')
    if (zIndex) {
      container.style.setProperty('--sv-fullscreen-z-index', zIndex, priority)
    } else {
      container.style.removeProperty('--sv-fullscreen-z-index')
    }
    placeholder.replaceWith(container)
  }
  isWindowFullscreen.value = true
}

/** 按模式切换全屏，防止重复提交原生全屏请求。 */
async function toggle() {
  if (pending.value) return
  if (!props.f11) {
    if (isWindowFullscreen.value) {
      exitWindow()
    } else {
      enterWindow()
    }
    full.value = isWindowFullscreen.value
    return
  }

  pending.value = true
  ownsNativeFullscreen = true
  nativeCancelled = false
  try {
    await toggleNative()
    if (nativeCancelled) {
      await exitNative()
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '切换全屏失败')
  } finally {
    ownsNativeFullscreen = isNativeFullscreen.value
    pending.value = false
  }
}

/** 更换目标、切换模式或卸载前退出，避免遗留铺满样式或原生全屏。 */
function cleanup() {
  exitWindow()
  nativeCancelled = true
  if (!ownsNativeFullscreen) return
  void exitNative().catch((error: unknown) => {
    ElMessage.error(error instanceof Error ? error.message : '退出全屏失败')
  })
}

onKeyStroke('Escape', (event) => {
  if (props.f11 || !isWindowFullscreen.value || event.defaultPrevented) return
  event.preventDefault()
  exitWindow()
  full.value = false
})
watch(isNativeFullscreen, (value, _, onCleanup) => {
  if (!value) {
    ownsNativeFullscreen = false
    if (props.f11) {
      exitWindow()
    }
    return
  }
  if (!props.f11 || !ownsNativeFullscreen || nativeCancelled) return

  enterWindow()
  if (isWindowFullscreen.value) return

  const container = document.documentElement
  container.classList.add('sv-native-fullscreen-container')
  onCleanup(() => container.classList.remove('sv-native-fullscreen-container'))
})
watch([() => props.f11, () => props.container], cleanup, { flush: 'sync' })
watch([full, () => props.f11, () => props.container], () => {
  if (props.f11) return
  if (full.value) {
    enterWindow()
  } else {
    exitWindow()
  }
}, { immediate: true, flush: 'post' })
onBeforeUnmount(cleanup)
</script>

<style lang="scss" scoped>
:global(.sv-fullscreen-container),
:global(.sv-native-fullscreen-container) {
  box-sizing: border-box !important;
  padding: 16px !important;
  background-color: var(--el-bg-color);
}

:global(.sv-fullscreen-container) {
  position: fixed !important;
  inset: 0 !important;
  z-index: var(--sv-fullscreen-z-index) !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  overflow: auto !important;
  transform: none !important;
}

:global(html:has(.sv-fullscreen-container)),
:global(body:has(> .sv-fullscreen-container)) {
  overflow: hidden !important;
}
</style>
