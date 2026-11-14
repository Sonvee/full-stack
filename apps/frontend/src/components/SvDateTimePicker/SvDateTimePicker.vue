<template>
  <el-date-picker
    v-model="pickerValue"
    type="datetimerange"
    :format="dateTimeConfig.format"
    :value-format="dateTimeConfig.format"
    :default-time="defaultTime"
    :shortcuts="shortcuts"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    range-separator="至"
    class="min-w-0 w-full!"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElDatePicker } from 'element-plus'
import { dateTimeConfig } from '@/config/date-time'
import { formatDateTime, getDateTime, parseDateTime } from '@/utils/date-time'

/** 按开始、结束顺序返回 Unix 毫秒时间戳，清空时为 null。 */
const model = defineModel<[number, number] | null>({ default: null })

/** 面板显示配置时区的日历时间，提交时转换为时间戳；结束边界包含整秒。 */
const pickerValue = computed<[string, string] | null>({
  get(): [string, string] | null {
    const range = model.value
    if (!range) return null
    return [formatDateTime(range[0]), formatDateTime(range[1])]
  },
  set(value) {
    model.value = value
      ? [parseDateTime(value[0]).valueOf(), parseDateTime(value[1]).endOf('second').valueOf()]
      : null
  },
})

/** 手动选择日期时，默认覆盖当天 00:00:00 至 23:59:59。 */
const defaultTime: [Date, Date] = [new Date(2000, 0, 1), new Date(2000, 0, 1, 23, 59, 59)]

/** 快捷范围包含当日；最近一周、一月分别为最近 7 天、30 天。 */
const shortcuts = [
  {
    text: '当日',
    value: () => getShortcutRange(1),
  },
  {
    text: '最近一周',
    value: () => getShortcutRange(7),
  },
  {
    text: '最近一月',
    value: () => getShortcutRange(30),
  },
]

/** 快捷值使用面板可直接解析的日历格式，再由模型转换为对应时区的时间戳。 */
function getShortcutRange(days: number) {
  const today = getDateTime()
  return [
    today.subtract(days - 1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    today.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]
}
</script>

<style lang="scss" scoped></style>
