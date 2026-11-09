<template>
  <Dialog v-model:open="open" @update:open="handleOpenChange">
    <DialogContent class="flex max-h-[85svh] flex-col sm:max-w-xl">
      <DialogHeader class="shrink-0">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>请填写各数据项。</DialogDescription>
      </DialogHeader>
      <SvForm
        ref="actionFormRef"
        v-model:model="formData"
        :rules="rules"
        class="flex min-h-0 min-w-0 flex-col gap-4"
        content-class="grid min-h-0 min-w-0 overflow-x-hidden overflow-y-auto gap-4 p-1 sm:grid-cols-2"
      >
        <SvFormItem prop="aInput" label="数据项甲">
          <SvInput v-model="formData.aInput" clearable placeholder="请输入数据项甲" :maxlength="100" />
        </SvFormItem>
        <SvFormItem prop="bInput" label="数据项乙">
          <SvInput v-model="formData.bInput" clearable placeholder="请输入数据项乙" :maxlength="100" />
        </SvFormItem>
        <SvFormItem prop="cInput" label="数据项丙">
          <SvInput v-model="formData.cInput" clearable placeholder="请输入数据项丙" :maxlength="100" />
        </SvFormItem>
        <SvFormItem prop="dSelect" label="数据项丁">
          <SvDictSelect v-model="formData.dSelect" :dict-list="dict_d_select" label-key="label" value-key="value" />
        </SvFormItem>
        <SvFormItem prop="eSelect" label="数据项戊">
          <SvDictSelect v-model="formData.eSelect" :dict-list="dict_e_select" label-key="label" value-key="value" />
        </SvFormItem>
        <SvFormItem prop="fSelect" label="数据项己">
          <SvDictSelect v-model="formData.fSelect" :dict-list="dict_f_select" label-key="label" value-key="value" />
        </SvFormItem>
        <SvFormItem prop="gSelect" label="数据项庚">
          <SvDictSelect v-model="formData.gSelect" :dict-list="dict_g_select" label-key="label" value-key="value" />
        </SvFormItem>
      </SvForm>
      <DialogFooter class="shrink-0">
        <DialogClose as-child>
          <Button type="button" variant="outline">取消</Button>
        </DialogClose>
        <Button type="button" @click="toConfirm">
          {{ mode === 'add' ? '新增' : '保存修改' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { inject, ref, useTemplateRef } from 'vue'
import { cloneDeep } from 'es-toolkit'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import SvForm from '@/components/SvForm/SvForm.vue'
import type { SvFormRules } from '@/components/SvForm/types'
import SvFormItem from '@/components/SvForm/SvFormItem.vue'
import SvInput from '@/components/SvInput/SvInput.vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { DemoListItem } from '@/types/demo'

defineProps<{ title: string; mode: 'add' | 'update' }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [values: DemoListItem] }>()
const { dict_d_select, dict_e_select, dict_f_select, dict_g_select } = inject<any>('__DICT__')

const defaultFormData: DemoListItem = {
  id: '',
  aInput: '',
  bInput: '',
  cInput: '',
  dSelect: '选项甲',
  eSelect: '选项甲',
  fSelect: '选项甲',
  gSelect: '选项甲',
  createdAt: ''
}
const formData = ref<DemoListItem>(defaultFormData)
const actionFormRef = useTemplateRef('actionFormRef')
const rules: SvFormRules<DemoListItem> = {
  aInput: [{ required: true, message: '请输入数据项甲', trigger: ['blur', 'change'] }],
  bInput: [{ required: true, message: '请输入数据项乙', trigger: ['blur', 'change'] }],
  cInput: [{ required: true, message: '请输入数据项丙', trigger: ['blur', 'change'] }],
  dSelect: [{ required: true, message: '请选择数据项丁', trigger: 'change' }],
  eSelect: [{ required: true, message: '请选择数据项戊', trigger: 'change' }],
  fSelect: [{ required: true, message: '请选择数据项己', trigger: 'change' }],
  gSelect: [{ required: true, message: '请选择数据项庚', trigger: 'change' }]
}

/** 弹窗关闭时重置表单。 */
function handleOpenChange(value: boolean) {
  if (!value) {
    actionFormRef.value?.resetFields()
  }
}

/** 为新增或编辑操作填入独立的表单数据。 */
function initForm(row?: DemoListItem) {
  formData.value = cloneDeep(row ?? defaultFormData)
}

/** 校验通过后将表单数据交给页面处理。 */
function submit(values: DemoListItem) {
  emit('confirm', values)
}

function toConfirm() {
  void actionFormRef.value?.validate((valid) => {
    if (valid) {
      submit(cloneDeep(formData.value))
    }
  })
}

defineExpose({ initForm })
</script>

<style lang="scss" scoped></style>
