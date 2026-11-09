<template>
  <Dialog v-model:open="open">
    <DialogContent class="flex max-h-[85svh] flex-col sm:max-w-xl">
      <DialogHeader class="shrink-0">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>请填写各数据项。</DialogDescription>
      </DialogHeader>
      <SvForm
        ref="actionForm"
        v-model:model="formData"
        :rules="rules"
        class="flex min-h-0 min-w-0 flex-col gap-4"
        content-class="grid min-h-0 min-w-0 overflow-x-hidden overflow-y-auto gap-4 p-1 sm:grid-cols-2"
        @submit="submit"
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
        <template #footer="{ isSubmitting }">
          <DialogFooter class="shrink-0">
            <DialogClose as-child>
              <Button type="button" variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" :disabled="isSubmitting" @click.prevent="toConfirm">
              {{ mode === 'add' ? '新增' : '保存修改' }}
            </Button>
          </DialogFooter>
        </template>
      </SvForm>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { inject, ref, useTemplateRef, watch } from 'vue'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import SvForm from '@/components/SvForm/SvForm.vue'
import type { SvFormInstance, SvFormRules } from '@/components/SvForm/types'
import SvFormItem from '@/components/SvForm/SvFormItem.vue'
import SvInput from '@/components/SvInput/SvInput.vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { DemoDictData, DemoFormValues, DemoListItem } from '@/types/demo'

defineProps<{ title: string; mode: 'add' | 'update' }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [values: DemoFormValues] }>()
const { dict_d_select, dict_e_select, dict_f_select, dict_g_select } = inject<DemoDictData>('__DICT__')!

const defaultFormValues: DemoFormValues = {
  aInput: '',
  bInput: '',
  cInput: '',
  dSelect: '选项甲',
  eSelect: '选项甲',
  fSelect: '选项甲',
  gSelect: '选项甲'
}
const formData = ref<DemoFormValues>({ ...defaultFormValues })
const actionForm = useTemplateRef<SvFormInstance>('actionForm')
const rules: SvFormRules<DemoFormValues> = {
  aInput: [{ required: true, message: '请输入数据项甲', trigger: ['blur', 'change'] }],
  bInput: [{ required: true, message: '请输入数据项乙', trigger: ['blur', 'change'] }],
  cInput: [{ required: true, message: '请输入数据项丙', trigger: ['blur', 'change'] }],
  dSelect: [{ required: true, message: '请选择数据项丁', trigger: 'change' }],
  eSelect: [{ required: true, message: '请选择数据项戊', trigger: 'change' }],
  fSelect: [{ required: true, message: '请选择数据项己', trigger: 'change' }],
  gSelect: [{ required: true, message: '请选择数据项庚', trigger: 'change' }]
}

watch(open, (value) => {
  if (!value) {
    actionForm.value?.resetFields()
  }
}, { flush: 'sync' })

/** 为新增或编辑操作填入独立的表单数据。 */
function initForm(item?: DemoListItem) {
  formData.value = item
    ? {
        aInput: item.aInput,
        bInput: item.bInput,
        cInput: item.cInput,
        dSelect: item.dSelect,
        eSelect: item.eSelect,
        fSelect: item.fSelect,
        gSelect: item.gSelect
      }
    : { ...defaultFormValues }
}

/** 校验通过后将表单数据交给页面处理。 */
function submit(values: DemoFormValues) {
  emit('confirm', values)
}

function toConfirm() {
  void actionForm.value?.validate((valid) => {
    if (valid) {
      submit({ ...formData.value })
    }
  })
}

defineExpose({ initForm })
</script>

<style lang="scss" scoped></style>
