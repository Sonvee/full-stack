<template>
  <el-dialog
    v-model="open"
    :title="mode === 'add' ? '新增测试样例' : '修改测试样例'"
    width="min(40rem, calc(100vw - 2rem))"
    align-center
    append-to-body
    destroy-on-close
    :close-on-click-modal="!loading"
    :close-on-press-escape="!loading"
    :show-close="!loading"
  >
    <el-form
      ref="actionFormRef"
      :model="formData"
      :rules="rules"
      :disabled="loading"
      label-position="top"
      class="grid max-h-[60svh] min-w-0 overflow-x-hidden overflow-y-auto gap-x-4 p-1 sm:grid-cols-2"
      @submit.prevent="toConfirm"
    >
      <el-form-item prop="name" label="测试名称">
        <el-input
          v-model.trim="formData.name"
          clearable
          placeholder="请输入测试名称"
          :maxlength="100"
        />
      </el-form-item>
      <el-form-item prop="operator" label="操作人">
        <el-input
          v-model.trim="formData.operator"
          clearable
          placeholder="请输入本次操作人"
          :maxlength="100"
        />
      </el-form-item>
      <el-form-item prop="icon" label="测试图标">
        <SvIconSelect v-model="formData.icon" clearable />
      </el-form-item>
      <el-form-item prop="number" label="测试数字">
        <el-input-number v-model="formData.number" controls-position="right" class="w-full!" />
      </el-form-item>
      <el-form-item prop="enabled" label="测试开关">
        <el-switch v-model="formData.enabled" active-text="开启" inactive-text="关闭" />
      </el-form-item>
      <el-form-item prop="singleSelect" label="测试单选">
        <SvDictSelect
          v-model="formData.singleSelect"
          :dict-list="dict_single_select"
          label-key="label"
          value-key="value"
          placeholder="请选择测试单选"
        />
      </el-form-item>
      <el-form-item prop="multiSelect" label="测试多选" class="sm:col-span-2">
        <SvDictSelect
          v-model="formData.multiSelect"
          :dict-list="dict_multi_select"
          label-key="label"
          value-key="value"
          multiple
          clearable
          placeholder="请选择，可留空"
        />
      </el-form-item>
      <el-form-item prop="description" label="测试描述" class="sm:col-span-2">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          :maxlength="2000"
          show-word-limit
          placeholder="请输入测试描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="loading" @click="open = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="toConfirm">
        {{ mode === 'add' ? '确认新增' : '保存修改' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, useTemplateRef } from 'vue'
import { cloneDeep } from 'es-toolkit'
import type { FormRules } from 'element-plus'
import SvDictSelect from '@/components/SvDictSelect/SvDictSelect.vue'
import SvIconSelect from '@/components/SvIconSelect/SvIconSelect.vue'
import type { TestSampleListItem } from '@/types/test-sample'
import { dict_multi_select, dict_single_select } from '../dict-data'

const props = defineProps<{ mode: 'add' | 'update'; loading: boolean }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [values: TestSampleListItem] }>()

/** 新增样例的默认表单数据，编号与创建、更新时间由服务端维护。 */
const defaultFormData: TestSampleListItem = {
  name: '',
  description: '',
  icon: 'sv-icon-tool',
  number: 0,
  enabled: false,
  singleSelect: '选项甲',
  multiSelect: [],
  operator: '',
}
/** 独立的表单草稿，避免编辑时直接修改表格行。 */
const formData = ref(cloneDeep(defaultFormData))
const actionFormRef = useTemplateRef('actionFormRef')

/** 表单校验规则。 */
const rules: FormRules<TestSampleListItem> = {
  name: [
    { required: true, whitespace: true, message: '请输入测试名称', trigger: ['blur', 'change'] },
  ],
  operator: [
    { required: true, whitespace: true, message: '请输入操作人', trigger: ['blur', 'change'] },
  ],
  number: [
    { type: 'number', required: true, message: '请输入有效的数字', trigger: ['blur', 'change'] },
  ],
  singleSelect: [{ required: true, message: '请选择测试单选', trigger: 'change' }],
}

/** 创建独立的表单副本，排除编号和审计时间等只读字段。 */
async function initForm(row?: TestSampleListItem) {
  formData.value = row
    ? {
        name: row.name,
        description: row.description,
        icon: row.icon,
        number: row.number,
        enabled: row.enabled,
        singleSelect: row.singleSelect,
        multiSelect: [...row.multiSelect],
        operator: row.operator,
      }
    : cloneDeep(defaultFormData)
  await nextTick()
  actionFormRef.value?.clearValidate()
}

/** 校验通过后将表单副本交给父页面执行新增或修改。 */
function toConfirm() {
  if (props.loading) return
  void actionFormRef.value?.validate((valid) => {
    if (valid) {
      emit('confirm', cloneDeep(formData.value))
    }
  })
}

defineExpose({ initForm })
</script>

<style lang="scss" scoped></style>
