/** date/datetime 为单值，daterange/datetimerange 为起止双值。 */
export type SvDatePickerType = 'date' | 'daterange' | 'datetime' | 'datetimerange'

/**
 * 日期值：单值为字符串，范围为双元素数组，清空为 null。
 *
 * @remarks
 * date 使用 YYYY-MM-DD；datetime 使用 YYYY-MM-DDTHH:mm:ss，不包含时区。
 * 范围两侧须使用相同格式且按时间升序排列；只在选择完整后更新绑定值。
 */
export type SvDatePickerValue = string | [string, string] | null
