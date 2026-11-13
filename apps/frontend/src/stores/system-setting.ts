import { ref } from 'vue'
import { defineStore } from 'pinia'

/** 管理并持久化系统设置。 */
export const useSystemSettingStore = defineStore('system-setting', () => {
  const full = ref(false)

  return { full }
}, {
  persist: true,
})
