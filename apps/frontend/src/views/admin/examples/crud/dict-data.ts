import type { InjectionKey } from 'vue'
import type { DemoFormValues } from '@/api/demo'

/** CRUD 示例字典选项。 */
export interface DemoDictOption {
  label: string
  value: string
}

/** CRUD 示例筛选条件，空字符串表示不限制该字段。 */
export interface DemoFilterValues extends DemoFormValues {
  id: string
  createdFrom: string
  createdTo: string
}

/** 页面及 CRUD 子组件共享的静态字典。 */
export interface DemoDictData {
  dSelect: readonly DemoDictOption[]
  eSelect: readonly DemoDictOption[]
  fSelect: readonly DemoDictOption[]
  gSelect: readonly DemoDictOption[]
}

/** CRUD 示例子组件的字典注入键。 */
export const demoDictKey: InjectionKey<DemoDictData> = Symbol('demoDictData')

/** CRUD 示例使用的静态字典数据。 */
export const demoDictData: DemoDictData = {
  dSelect: [
    { label: '选项甲', value: '选项甲' },
    { label: '选项乙', value: '选项乙' },
    { label: '选项丙', value: '选项丙' },
    { label: '选项丁', value: '选项丁' },
  ],
  eSelect: [
    { label: '选项甲', value: '选项甲' },
    { label: '选项乙', value: '选项乙' },
    { label: '选项丙', value: '选项丙' },
  ],
  fSelect: [
    { label: '选项甲', value: '选项甲' },
    { label: '选项乙', value: '选项乙' },
  ],
  gSelect: [
    { label: '选项甲', value: '选项甲' },
    { label: '选项乙', value: '选项乙' },
    { label: '选项丙', value: '选项丙' },
  ],
}
