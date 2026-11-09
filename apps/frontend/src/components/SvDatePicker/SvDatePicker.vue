<template>
  <Popover :open="open" @update:open="setOpen">
    <PopoverAnchor as-child>
      <InputGroup :class="props.class" :data-disabled="controlDisabled || undefined">
        <InputGroupInput
          ref="input"
          v-bind="$attrs"
          :model-value="displayValue"
          :placeholder="props.placeholder || (isRange ? '请选择日期范围' : '请选择日期')"
          :id="inputId"
          :aria-invalid="ariaInvalid"
          :aria-describedby="ariaDescribedby"
          :disabled="controlDisabled"
          :aria-expanded="open"
          aria-haspopup="dialog"
          readonly
          @click="setOpen(true)"
          @keydown.enter.space.down.prevent="setOpen(true)"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            v-if="props.clearable && modelValue && !controlDisabled && !props.readonly"
            type="button"
            size="icon-xs"
            aria-label="清空日期"
            title="清空日期"
            @mousedown.prevent
            @click="clear"
            ><i class="sv-icon-close" aria-hidden="true"
          /></InputGroupButton>
          <PopoverTrigger as-child>
            <InputGroupButton
              type="button"
              size="icon-xs"
              :disabled="controlDisabled || props.readonly"
              aria-label="选择日期"
              title="选择日期"
            >
              <i class="sv-icon-calendar" aria-hidden="true" />
            </InputGroupButton>
          </PopoverTrigger>
        </InputGroupAddon>
      </InputGroup>
    </PopoverAnchor>
    <PopoverContent class="w-auto max-h-[80svh] overflow-auto p-0" align="start">
      <RangeCalendar
        v-if="isRange"
        :model-value="range"
        :default-placeholder="range.start || defaultPlaceholder"
        :number-of-months="wideScreen ? 2 : 1"
        locale="zh-CN"
        calendar-label="日期范围"
        weekday-format="short"
        :week-starts-on="1"
        fixed-weeks
        initial-focus
        disable-days-outside-current-view
        @update:model-value="selectRange"
      />
      <Calendar
        v-else
        :model-value="range.start"
        :default-placeholder="range.start || defaultPlaceholder"
        locale="zh-CN"
        calendar-label="日期"
        weekday-format="short"
        :week-starts-on="1"
        layout="month-and-year"
        fixed-weeks
        initial-focus
        @update:model-value="selectDate"
      />
      <template v-if="withTime">
        <FieldGroup class="flex-row gap-3 px-3 pb-3">
          <Field>
            <FieldLabel :for="`${controlId}-start`">{{ isRange ? '开始时间' : '时间' }}</FieldLabel>
            <SvInput
              :id="`${controlId}-start`"
              :model-value="startTime"
              type="time"
              step="1"
              @update:model-value="startTime = String($event)"
            />
          </Field>
          <Field v-if="isRange">
            <FieldLabel :for="`${controlId}-end`">结束时间</FieldLabel>
            <SvInput
              :id="`${controlId}-end`"
              :model-value="endTime"
              type="time"
              step="1"
              @update:model-value="endTime = String($event)"
            />
          </Field>
        </FieldGroup>
        <FieldError v-if="rangeError" class="px-3 pb-3">{{ rangeError }}</FieldError>
        <div class="flex justify-end gap-2 border-t p-3">
          <Button type="button" variant="outline" size="sm" @click="setOpen(false)">取消</Button>
          <Button type="button" size="sm" :disabled="!canConfirm" @click="commit">确定</Button>
        </div>
      </template>
    </PopoverContent>
  </Popover>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  shallowRef,
  useAttrs,
  useId,
  useTemplateRef,
  watch,
  type HTMLAttributes,
} from 'vue'
import {
  getLocalTimeZone,
  toCalendarDate,
  today,
  type DateValue,
} from '@internationalized/date'
import { useFocus, useMediaQuery } from '@vueuse/core'
import type { DateRange } from 'reka-ui'
import dayjs, { DATE_TIME_FORMAT } from '@/lib/dayjs'
import SvInput from '@/components/SvInput/SvInput.vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { formatPickerValue, parsePickerBoundary, serializePickerBoundary } from './date-value'
import type { SvDatePickerType, SvDatePickerValue } from './types'
import { svFormFieldKey } from '@/components/SvForm/context'

defineOptions({ inheritAttrs: false })

/**
 * 四种日期模式共用配置；原生属性与事件透传到只读展示输入框。
 *
 * @remarks
 * 日期模式选完即提交；时间模式按“确定”提交。取消和关闭浮层丢弃尚未提交的选择。
 * class 作用于输入组；clearable 默认开启，disabled/readonly 禁止选择与清空。
 */
interface SvDatePickerProps {
  type?: SvDatePickerType
  class?: HTMLAttributes['class']
  placeholder?: string
  rangeSeparator?: string
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<SvDatePickerProps>(), {
  type: 'date',
  rangeSeparator: '至',
  clearable: true,
})
const attrs = useAttrs()
const formField = inject(svFormFieldKey, undefined)
const inputId = computed(() => (attrs.id as string | undefined) ?? formField?.id)
const ariaInvalid = computed(() => attrs['aria-invalid'] ?? formField?.invalid.value)
const ariaDescribedby = computed(
  () => attrs['aria-describedby'] ?? formField?.errorId.value,
)
const controlDisabled = computed(() => props.disabled ?? formField?.disabled.value ?? false)
/** 仅保存已确认的完整值；日期时间不转换为 UTC，空值统一为 null。 */
const modelValue = defineModel<SvDatePickerValue>({ default: null })
const emit = defineEmits<{ change: [value: SvDatePickerValue]; clear: [] }>()
const open = shallowRef(false)
const range = shallowRef<DateRange>({ start: undefined, end: undefined })
const startTime = shallowRef('00:00:00')
const endTime = shallowRef('00:00:00')
const input = useTemplateRef<InstanceType<typeof InputGroupInput>>('input')
const { focused } = useFocus(input, { preventScroll: true })
const controlId = useId()
const wideScreen = useMediaQuery('(min-width: 640px)')
const defaultPlaceholder = today(getLocalTimeZone())
const isRange = computed(() => props.type === 'daterange' || props.type === 'datetimerange')
const withTime = computed(() => props.type === 'datetime' || props.type === 'datetimerange')
const displayValue = computed(() => formatPickerValue(modelValue.value, props.rangeSeparator))
const draftValue = computed<SvDatePickerValue>(() => {
  if (!range.value.start || (isRange.value && !range.value.end)) {
    return null
  }
  if (withTime.value && (!startTime.value || (isRange.value && !endTime.value))) {
    return null
  }
  const start = serializePickerBoundary(
    toCalendarDate(range.value.start),
    startTime.value,
    withTime.value,
  )
  return isRange.value
    ? [
        start,
        serializePickerBoundary(toCalendarDate(range.value.end!), endTime.value, withTime.value),
      ]
    : start
})
const rangeError = computed(() => {
  const value = draftValue.value
  return withTime.value &&
    Array.isArray(value) &&
    dayjs(value[1], DATE_TIME_FORMAT, true).isBefore(dayjs(value[0], DATE_TIME_FORMAT, true))
    ? '结束时间不能早于开始时间'
    : ''
})
const canConfirm = computed(() => !!draftValue.value && !rangeError.value)

/** 从外部已确认的值重新创建草稿，确保关闭、重置及切换模式不会复用未提交值。 */
function resetDraft() {
  const value = modelValue.value
  const boundaries = Array.isArray(value) ? value : [value || undefined]
  const start = parsePickerBoundary(boundaries[0], withTime.value)
  const end = parsePickerBoundary(isRange.value ? boundaries[1] : undefined, withTime.value)
  range.value = { start: start.date, end: end.date }
  startTime.value = start.time
  endTime.value = end.time
}

/** 管理浮层生命周期，打开前读取当前绑定值，关闭时丢弃草稿。 */
function setOpen(value: boolean) {
  if (value && (controlDisabled.value || props.readonly)) {
    return
  }
  if (value) {
    resetDraft()
  }
  open.value = value
}

/** 接收单日选择，纯日期模式立即提交；日期时间模式等待确认。 */
function selectDate(value: DateValue | undefined) {
  range.value = { start: value, end: undefined }
  if (!withTime.value && value) {
    commit()
  }
}

/** 接收官方已排序的范围，只在两个边界均选中后提交纯日期范围。 */
function selectRange(value: DateRange) {
  range.value = value
  if (!withTime.value && value.start && value.end) {
    commit()
  }
}

/** 提交有效草稿，并发送与 v-model 一致的 change 事件。 */
function commit() {
  if (!canConfirm.value) {
    return
  }
  modelValue.value = draftValue.value
  emit('change', draftValue.value)
  open.value = false
}

/** 清空已确认值并恢复输入焦点；change 与 clear 事件只发送一次。 */
function clear() {
  modelValue.value = null
  open.value = false
  focused.value = true
  emit('change', null)
  emit('clear')
}

watch(
  () => [props.type, controlDisabled.value, props.readonly, modelValue.value],
  () => {
    open.value = false
  },
)
</script>

<style lang="scss" scoped></style>
