import { onMounted, shallowRef } from 'vue'
import type { ShallowRef } from 'vue'
import { apiDictDetail } from '@/api/dict'
import type { DictOption } from '@/types/dict'

/**
 * 在组件 setup 中调用，挂载后并行加载各字典的全部启用项。
 * 返回的 ref 可直接解构并通过 provide 共享，请求完成后自动更新。
 */
export function useDict<T extends string>(...dictTypes: T[]) {
  const dicts = Object.fromEntries(dictTypes.map((dictType) => [dictType, shallowRef<DictOption[]>([])])) as Record<T, ShallowRef<DictOption[]>>

  onMounted(async () => {
    await Promise.all(
      dictTypes.map(async (dictType) => {
        const res = await apiDictDetail({ dictType, status: '1', pageNum: 1, pageSize: -1 })
        dicts[dictType].value = res.data!.map(({ label, value, tagType }) => ({
          label,
          value,
          type: tagType
        }))
      })
    )
  })

  return dicts
}
