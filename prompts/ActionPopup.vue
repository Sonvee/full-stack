<template>
  <el-dialog v-bind="$attrs" ref="apDialogRef" width="768" destroy-on-close align-center>
    <el-form ref="apFormRef" :model="apForm" :rules="rules" label-width="auto" label-position="right">
      <el-row :gutter="20">
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="id" label="ID">
            <el-input v-model="apForm.id" placeholder="请输入ID" clearable :disabled="props.mode === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="text" label="文本">
            <el-input v-model="apForm.text" placeholder="请输入文本" clearable />
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="textRequired" label="必填文本">
            <el-input v-model="apForm.textRequired" placeholder="请输入必填文本" clearable />
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="option" label="选项">
            <el-select v-model="apForm.option" placeholder="请选择选项" filterable clearable>
              <el-option label="选项1" value="value1" />
              <el-option label="选项2" value="value2" />
              <el-option label="选项3" value="value3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="optionRange" label="多选">
            <el-select
              v-model="apForm.optionRange"
              placeholder="请选择多选"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
              clearable
            >
              <el-option label="选项1" value="value1" />
              <el-option label="选项2" value="value2" />
              <el-option label="选项3" value="value3" />
              <el-option label="选项4" value="value4" />
              <el-option label="选项5" value="value5" />
              <el-option label="选项6" value="value6" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="date" label="日期">
            <el-date-picker
              v-model="apForm.date"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="datetime" label="时间">
            <el-date-picker
              v-model="apForm.datetime"
              type="datetime"
              placeholder="请选择时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="datetimeRange" label="时间范围">
            <el-date-picker
              v-model="apForm.datetimeRange"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="num" label="数字">
            <el-input-number
              v-model="apForm.num"
              :min="0"
              :step="1"
              step-strictly
              align="left"
              controls-position="right"
              placeholder="请输入数字"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="action-popup__field" v-bind="elColProps">
          <el-form-item prop="status" label="状态">
            <DictSelect v-model="apForm.status" :dict-list="sys_status"></DictSelect>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button :icon="Close" @click="toClose">取消</el-button>
        <el-button :icon="Check" type="primary" @click="toConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Check, Close } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import type { ActionPopupEmits, ActionPopupProps, DemoFormModel, DemoFormPatch } from '@/types/demo'

const props = withDefaults(defineProps<ActionPopupProps>(), {
  mode: 'add'
})

const emits = defineEmits<ActionPopupEmits>()

// 字典
const { sys_status } = inject<DictContext>('__DICT__')!

// 表单项响应式配置
const elColProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 }

const apForm = ref<DemoFormModel>(createDefaultForm())

const apDialogRef = useTemplateRef('apDialogRef')
const apFormRef = useTemplateRef('apFormRef')
const rules: FormRules<DemoFormModel> = {
  textRequired: [{ required: true, message: '请输入必填文本', trigger: ['blur', 'change'] }]
}

/**
 * 创建弹窗表单默认值。
 *
 * 用方法而非常量提供默认值，是为了在初始化和重置时都生成独立对象，
 * 避免数组等引用字段被多个表单状态复用。
 */
function createDefaultForm(): DemoFormModel {
  return {
    id: '',
    text: '',
    textRequired: '',
    option: '',
    optionRange: [],
    date: '',
    datetime: '',
    datetimeRange: [],
    num: 0,
    status: 'enabled'
  }
}

/**
 * 初始化弹窗表单。
 *
 * @param form - 待回填的表单局部数据，新增时可传空对象。
 */
function initForm(form: DemoFormPatch) {
  Object.assign(apForm.value, createDefaultForm(), form)
}

/**
 * 校验弹窗表单并提交。
 */
function toConfirm() {
  apFormRef.value?.validate((valid) => {
    if (valid) {
      emits('confirm', { ...apForm.value })
    }
  })
}

/**
 * 清理校验状态并关闭弹窗。
 */
function toClose() {
  apFormRef.value?.clearValidate()
  apFormRef.value?.resetFields()
  apDialogRef.value?.handleClose()
  emits('close')
}

defineExpose({
  initForm
})
</script>

<style lang="scss" scoped></style>
