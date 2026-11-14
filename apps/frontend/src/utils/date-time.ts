import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

/** 前端统一的时间显示格式与时区；接口始终传输 Unix 毫秒时间戳。 */
export const dateTimeConfig = {
  format: 'YYYY-MM-DD HH:mm:ss',
  timezone: 'Asia/Shanghai',
}

/** 将 Unix 毫秒时间戳转换为配置时区的日期，默认使用当前时间。 */
export function getDateTime(value = Date.now()) {
  return dayjs(value).tz(dateTimeConfig.timezone)
}

/** 按前端配置显示 Unix 毫秒时间戳，未提供时间时保持空白。 */
export function formatDateTime(value?: number) {
  if (value === undefined) return ''
  return getDateTime(value).format(dateTimeConfig.format)
}

/** 将日期选择器的日历时间按配置格式和时区解析为日期。 */
export function parseDateTime(value: string) {
  return dayjs.tz(value, dateTimeConfig.format, dateTimeConfig.timezone)
}
