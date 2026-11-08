<template>
  <Button
    variant="outline"
    size="sm"
    :disabled="importing"
    title="导入数据 JSON 数组，编号和创建日期自动生成"
    @click="open()"
  >
    <i class="sv-icon-import" aria-hidden="true" data-icon="inline-start" />{{
      importing ? '导入中…' : '导入 JSON'
    }}
  </Button>
  <Button
    variant="outline"
    size="sm"
    :disabled="!records.length"
    title="导出全部符合当前筛选条件的数据"
    @click="exportRecords"
  >
    <i class="sv-icon-export" aria-hidden="true" data-icon="inline-start" />导出 JSON
  </Button>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { parseImportedRecords, type DataRecord, type FormValues } from '../data-model'

const { records } = defineProps<{ records: DataRecord[] }>()
const emit = defineEmits<{
  import: [values: FormValues[]]
  notice: [text: string, error: boolean]
}>()
const importing = shallowRef(false)
const { open, onChange, reset } = useFileDialog({
  accept: '.json,application/json',
  multiple: false,
})

onChange(async (files) => {
  const file = files?.item(0)
  if (!file) return
  importing.value = true
  try {
    const content: unknown = JSON.parse(await file.text())
    emit('import', parseImportedRecords(content))
  } catch (error) {
    const detail =
      error instanceof SyntaxError
        ? 'JSON 格式无效，请检查文件内容'
        : error instanceof Error
          ? error.message
          : '无法读取文件'
    emit('notice', `导入失败：${detail}`, true)
  } finally {
    importing.value = false
    reset()
  }
})

function exportRecords() {
  const blob = new Blob([JSON.stringify(records, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'data.json'
  link.click()
  // 给浏览器一次事件循环处理下载，再释放临时 URL。
  setTimeout(() => URL.revokeObjectURL(url), 0)
  emit('notice', `已导出符合当前筛选条件的 ${records.length} 条数据`, false)
}
</script>

<style lang="scss" scoped></style>
