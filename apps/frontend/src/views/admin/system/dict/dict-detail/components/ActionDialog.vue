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
      <el-form-item prop="label" label="字典标签">
        <el-input v-model.trim="formData.label" clearable placeholder="请输入展示标签" :maxlength="100" />
      </el-form-item>
      <el-form-item prop="value" label="字典键值">
        <el-input v-model.trim="formData.value" clearable placeholder="请输入字典键值" :maxlength="100" />
      </el-form-item>
      <el-form-item prop="index" label="排序">
        <el-input-number v-model="formData.index" :precision="0" :min="0" :max="2147483647" controls-position="right" class="w-full!" />
      </el-form-item>
      <el-form-item prop="tagType" label="标签样式">
        <SvDictSelect v-model="formData.tagType" :dict-list="sys_tag_type" label-key="label" value-key="value" />
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <SvDictSelect v-model="formData.status" :dict-list="sys_status" label-key="label" value-key="value" placeholder="请选择状态" />
      </el-form-item>
      <el-form-item prop="remark" label="备注" class="sm:col-span-2">
        <el-input v-model="formData.remark" type="textarea" :rows="3" :maxlength="500" show-word-limit placeholder="请输入备注" />
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
import type { DictDetailListItem } from '@/types/dict'

const { dictType } = defineProps<{ title: string; mode: 'add' | 'update'; loading: boolean; dictType: string }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [values: DictDetailListItem] }>()

/** 注入字典数据。 */
const { sys_status, sys_tag_type } = inject<any>('__DICT__')

/** 新增字典数据的默认表单，编号与创建、更新时间由服务端维护。 */
const defaultFormData: DictDetailListItem = {
  dictType,
  label: '',
  value: '',
  index: 0,
  status: '1',
  tagType: 'primary',
  remark: ''
}

/** 表单数据。 */
const formData = ref(cloneDeep(defaultFormData))
const actionFormRef = useTemplateRef('actionFormRef')

/** 表单校验规则。 */
const rules: FormRules<DictDetailListItem> = {
  label: [{ required: true, message: '请输入字典标签', trigger: ['blur', 'change'] }],
  value: [{ required: true, message: '请输入字典键值', trigger: ['blur', 'change'] }],
  index: [{ required: true, message: '请输入有效的排序整数', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  tagType: [{ required: true, message: '请选择标签样式', trigger: 'change' }]
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
function initForm(row?: DictDetailListItem) {
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
