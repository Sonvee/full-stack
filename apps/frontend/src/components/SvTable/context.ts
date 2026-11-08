import type { InjectionKey } from 'vue'
import type { SvTableColumnDefinition } from './types'

/** 每个表格独立维护列的注册与卸载；列按声明时的顺序排列。 */
export interface SvTableContext {
  register: (column: SvTableColumnDefinition) => void
  unregister: (id: string) => void
}

/** 将声明列绑定到最近的 SvTable，避免多实例之间共享状态。 */
export const svTableKey: InjectionKey<SvTableContext> = Symbol('SvTable')
