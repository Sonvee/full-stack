import {
  parseDate,
  parseDateTime,
  toCalendarDate,
  type CalendarDate,
} from '@internationalized/date'
import type { SvDatePickerValue } from './types'

/**
 * 读取一个选择器边界，复用日期库校验并提取不含时区的日期与时间。
 *
 * @param value - 空值或符合当前模式的单个边界。
 * @param withTime - 是否按日期时间格式解析。
 * @returns 空边界返回未选日期及零点，否则返回解析后的公历日期和时间。
 * @throws 非空边界格式无效时由日期库抛出错误；调用方须遵守值契约。
 */
export function parsePickerBoundary(
  value: string | undefined,
  withTime: boolean,
): { date: CalendarDate | undefined; time: string } {
  if (!value) return { date: undefined, time: '00:00:00' }
  if (!withTime) return { date: parseDate(value), time: '00:00:00' }
  const parsed = parseDateTime(value)
  return { date: toCalendarDate(parsed), time: parsed.toString().split('T')[1]! }
}

/**
 * 合并日历日期与时间输入，使用日期库验证边界并统一保留秒。
 *
 * @param date - 当前选中的公历日期。
 * @param time - 原生时间输入产生的 HH:mm 或 HH:mm:ss。
 * @param withTime - 为 false 时仅输出日期。
 * @returns 统一格式的本地日期或日期时间字符串。
 * @throws 日期时间组合无效时由日期库抛出错误。
 */
export function serializePickerBoundary(
  date: CalendarDate,
  time: string,
  withTime: boolean,
): string {
  if (!withTime) return date.toString()
  return parseDateTime(`${date}T${time.length === 5 ? `${time}:00` : time}`).toString()
}

/**
 * 生成展示文本，不改变绑定值中的日期时间格式。
 *
 * @param value - 已提交的单值、完整范围或空值。
 * @param separator - 范围边界之间的展示分隔符。
 * @returns 空值显示为空，其余值将 ISO 日期时间中的 T 显示为空格。
 */
export function formatPickerValue(value: SvDatePickerValue, separator: string): string {
  if (!value) return ''
  return (Array.isArray(value) ? value : [value])
    .map((part) => part.replace('T', ' '))
    .join(` ${separator} `)
}
