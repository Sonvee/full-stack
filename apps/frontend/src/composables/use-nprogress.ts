import NProgress from 'nprogress'

/** 在全局路由守卫中调用一次，提供顶部进度条控制。 */
export function useNProgress() {
  NProgress.configure({ showSpinner: false })

  function start() {
    if (NProgress.isStarted()) return
    NProgress.start()
  }

  function done() {
    NProgress.done()
  }

  return { start, done }
}
