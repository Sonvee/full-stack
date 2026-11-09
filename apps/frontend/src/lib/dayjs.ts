import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// 统一从此入口使用 Day.js，使指定格式的严格解析始终可用。
dayjs.extend(customParseFormat)

/** 业务日期统一格式。 */
export const DATE_FORMAT = 'YYYY-MM-DD'

/** 业务日期时间统一格式，保留秒且不包含时区。 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default dayjs
