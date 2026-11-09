import { parseDate, type CalendarDate } from '@internationalized/date'
import dayjs, { DATE_FORMAT, DATE_TIME_FORMAT } from '@/lib/dayjs'
import type { SvDatePickerValue } from './types'

/**
 * 严格解析一个选择器边界，并转换为日历组件使用的日期与时间。
 *
 * @param value - 空值或符合当前模式的单个边界。
 * @param withTime - 是否按日期时间格式解析。
 * @returns 空边界返回未选日期及零点，否则返回解析后的公历日期和时间。
 * @throws 非空边界不符合固定格式或日期无效时抛出 RangeError。
 */
export function parsePickerBoundary(
  value: string | undefined,
  withTime: boolean,
): { date: CalendarDate | undefined; time: string } {
  if (!value) {
    return { date: undefined, time: '00:00:00' }
  }
  const format = withTime ? DATE_TIME_FORMAT : DATE_FORMAT
  const parsed = dayjs(value, format, true)
  if (!parsed.isValid()) {
    throw new RangeError(`日期值无效，须符合 ${format} 格式`)
  }
  return { date: parseDate(parsed.format(DATE_FORMAT)), time: parsed.format('HH:mm:ss') }
}

/**
 * 合并日历日期与时间输入，通过 Day.js 严格校验并输出固定格式。
 *
 * @param date - 当前选中的公历日期。
 * @param time - 原生时间输入产生的 HH:mm 或 HH:mm:ss。
 * @param withTime - 为 false 时仅输出日期。
 * @returns YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss 格式的本地字符串。
 * @throws 日期时间组合无效时抛出 RangeError。
 */
export function serializePickerBoundary(
  date: CalendarDate,
  time: string,
  withTime: boolean,
): string {
  const format = withTime ? DATE_TIME_FORMAT : DATE_FORMAT
  const value = withTime
    ? `${date} ${time.length === 5 ? `${time}:00` : time}`
    : date.toString()
  const parsed = dayjs(value, format, true)
  if (!parsed.isValid()) {
    throw new RangeError(`日期值无效，须符合 ${format} 格式`)
  }
  return parsed.format(format)
}

/**
 * 生成展示文本，不改变绑定值中的日期时间格式。
 *
 * @param value - 已提交的单值、完整范围或空值。
 * @param separator - 范围边界之间的展示分隔符。
 * @returns 空值显示为空，范围使用指定分隔符连接。
 */
export function formatPickerValue(value: SvDatePickerValue, separator: string): string {
  if (!value) {
    return ''
  }
  return (Array.isArray(value) ? value : [value]).join(` ${separator} `)
}
