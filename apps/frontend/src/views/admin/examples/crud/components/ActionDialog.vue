<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="min(36rem, calc(100vw - 2rem))"
    align-center
    append-to-body
    destroy-on-close
    @closed="handleClosed"
  >
    <el-form
      ref="actionFormRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="grid max-h-[60svh] min-w-0 overflow-x-hidden overflow-y-auto gap-x-4 p-1 sm:grid-cols-2"
      @submit.prevent="toConfirm"
    >
      <el-form-item prop="aInput" label="数据项甲">
        <el-input v-model="formData.aInput" clearable placeholder="请输入数据项甲" :maxlength="100" />
      </el-form-item>
      <el-form-item prop="bInput" label="数据项乙">
        <el-input v-model="formData.bInput" clearable placeholder="请输入数据项乙" :maxlength="100" />
      </el-form-item>
      <el-form-item prop="cInput" label="数据项丙">
        <el-input v-model="formData.cInput" clearable placeholder="请输入数据项丙" :maxlength="100" />
      </el-form-item>
      <el-form-item prop="dSelect" label="数据项丁">
        <SvDictSelect v-model="formData.dSelect" :dict-list="dict_d_select" label-key="label" value-key="value" />
      </el-form-item>
      <el-form-item prop="eSelect" label="数据项戊">
        <SvDictSelect v-model="formData.eSelect" :dict-list="dict_e_select" label-key="label" value-key="value" multiple />
      </el-form-item>
      <el-form-item prop="fSelect" label="数据项己">
        <SvDictSelect v-model="formData.fSelect" :dict-list="dict_f_select" label-key="label" value-key="value" />
      </el-form-item>
      <el-form-item prop="gSelect" label="数据项庚">
        <SvDictSelect v-model="formData.gSelect" :dict-list="dict_g_select" label-key="label" value-key="value" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="toClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="toConfirm">
        {{ mode === 'add' ? '确认新增' : '保存修改' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { inject, ref, useTemplateRef } from 'vue'
import { cloneDeep } from 'es-toolkit'
import type { FormRules } from 'element-plus'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import type { DemoListItem } from '@/types/demo'

defineProps<{ title: string; mode: 'add' | 'update'; loading: boolean }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [values: DemoListItem] }>()

/** 注入字典数据。 */
const { dict_d_select, dict_e_select, dict_f_select, dict_g_select } = inject<any>('__DICT__')

/** 默认表单数据。 */
const defaultFormData = {
  id: '',
  aInput: '',
  bInput: '',
  cInput: '',
  dSelect: '选项甲',
  eSelect: ['选项甲'],
  fSelect: '选项甲',
  gSelect: '选项甲',
  createdAt: ''
}

/** 表单数据。 */
const formData = ref(cloneDeep(defaultFormData))
const actionFormRef = useTemplateRef('actionFormRef')

/** 表单校验规则。 */
const rules: FormRules<DemoListItem> = {
  aInput: [{ required: true, message: '请输入数据项甲', trigger: ['blur', 'change'] }],
  bInput: [{ required: true, message: '请输入数据项乙', trigger: ['blur', 'change'] }],
  cInput: [{ required: true, message: '请输入数据项丙', trigger: ['blur', 'change'] }],
  dSelect: [{ required: true, message: '请选择数据项丁', trigger: 'change' }],
  eSelect: [{ type: 'array', required: true, message: '请选择数据项戊', trigger: 'change' }],
  fSelect: [{ required: true, message: '请选择数据项己', trigger: 'change' }],
  gSelect: [{ required: true, message: '请选择数据项庚', trigger: 'change' }]
}

/** 关闭弹窗。 */
function toClose() {
  open.value = false
}

/** 弹窗关闭完成后重置表单。 */
function handleClosed() {
  resetForm()
}

/** 重置表单数据和校验状态。 */
function resetForm() {
  actionFormRef.value?.clearValidate()
  formData.value = cloneDeep(defaultFormData)
}

/** 为新增或编辑操作填入独立的表单数据。 */
function initForm(row?: DemoListItem) {
  formData.value = cloneDeep(row ?? defaultFormData)
}

/** 校验通过后将表单数据交给页面处理。 */
function toConfirm() {
  void actionFormRef.value?.validate((valid) => {
    if (valid) {
      emit('confirm', formData.value)
    }
  })
}

defineExpose({ initForm })
</script>

<style lang="scss" scoped></style>
