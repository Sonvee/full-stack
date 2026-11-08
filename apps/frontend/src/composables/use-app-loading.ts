import { nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

/** 在根组件中调用，首次路由渲染完成后移除初始化 loading。 */
export function useAppLoading(): void {
  const router = useRouter()

  onMounted(async () => {
    await router.isReady()
    await nextTick()

    const loading = document.getElementById('app-loading')
    if (loading) {
      loading
        .animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180,
          easing: 'ease-out',
        })
        .finished.then(() => loading.remove())
    }
  })
}
