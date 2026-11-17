<template>
  <el-dialog
    v-model="open"
    :title="title"
    width="min(40rem, calc(100vw - 2rem))"
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
      <el-form-item prop="name" label="测试名称">
        <el-input v-model.trim="formData.name" clearable placeholder="请输入测试名称" :maxlength="100" />
      </el-form-item>
      <el-form-item prop="operator" label="操作人">
        <el-input v-model.trim="formData.operator" clearable placeholder="请输入本次操作人" :maxlength="100" />
      </el-form-item>
      <el-form-item prop="icon" label="测试图标">
        <SvIconSelect v-model="formData.icon" clearable />
      </el-form-item>
      <el-form-item prop="index" label="排序">
        <el-input-number v-model="formData.index" :precision="0" controls-position="right" class="w-full!" />
      </el-form-item>
      <el-form-item prop="number" label="测试数字">
        <el-input-number v-model="formData.number" :precision="2" :step="0.1" controls-position="right" class="w-full!" />
      </el-form-item>
      <el-form-item prop="status" label="测试状态">
        <SvDictSelect
          v-model="formData.status"
          :dict-list="sys_status"
          label-key="label"
          value-key="value"
          placeholder="请选择测试状态"
        />
      </el-form-item>
      <el-form-item prop="singleSelect" label="测试单选">
        <SvDictSelect
          v-model="formData.singleSelect"
          :dict-list="test_single_select"
          label-key="label"
          value-key="value"
          placeholder="请选择测试单选"
        />
      </el-form-item>
      <el-form-item prop="multiSelect" label="测试多选">
        <SvDictSelect
          v-model="formData.multiSelect"
          :dict-list="test_multi_select"
          label-key="label"
          value-key="value"
          multiple
          clearable
          check-all
          placeholder="请选择测试多选"
        />
      </el-form-item>
      <el-form-item prop="description" label="测试描述" class="sm:col-span-2">
        <el-input v-model="formData.description" type="textarea" :rows="3" :maxlength="2000" show-word-limit placeholder="请输入测试描述" />
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
import { cloneDeep, omit } from 'es-toolkit'
import type { FormRules } from 'element-plus'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import SvIconSelect from '@/components/SvIconSelect/SvIconSelect.vue'
import type { TestSampleListItem } from '@/types/test-sample'

defineProps<{ title: string; mode: 'add' | 'update'; loading: boolean }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [values: TestSampleListItem] }>()

/** 注入字典数据。 */
const { sys_status, test_single_select, test_multi_select } = inject<any>('__DICT__')

/** 新增样例的默认表单数据，编号与创建、更新时间由服务端维护。 */
const defaultFormData: TestSampleListItem = {
  name: '',
  description: '',
  icon: 'sv-icon-tool',
  number: 0,
  index: 0,
  status: '',
  singleSelect: '',
  multiSelect: [],
  operator: ''
}

/** 表单数据。 */
const formData = ref(cloneDeep(defaultFormData))
const actionFormRef = useTemplateRef('actionFormRef')

/** 表单校验规则。 */
const rules: FormRules<TestSampleListItem> = {
  name: [{ required: true, message: '请输入测试名称', trigger: ['blur', 'change'] }],
  operator: [{ required: true, message: '请输入操作人', trigger: ['blur', 'change'] }],
  number: [{ required: true, message: '请输入有效的数字', trigger: ['blur', 'change'] }],
  index: [{ required: true, message: '请输入有效的排序整数', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '请选择测试状态', trigger: 'change' }],
  singleSelect: [{ required: true, message: '请选择测试单选', trigger: 'change' }]
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

/** 为新增或编辑操作填入独立的表单数据，排除服务端维护的时间字段。 */
function initForm(row?: TestSampleListItem) {
  formData.value = cloneDeep(row ? omit(row, ['createdAt', 'updatedAt']) : defaultFormData)
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
