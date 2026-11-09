<template>
  <div class="search-filter" :class="{ 'search-filter--collapsed': isCollapsed }">
    <el-form ref="sfFormRef" :model="sfForm" :rules="rules" inline label-width="auto" label-position="right">
      <el-row :gutter="20">
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="text" label="文本">
            <el-input v-model="sfForm.text" placeholder="请输入文本" clearable />
          </el-form-item>
        </el-col>
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="textRequired" label="必填文本">
            <el-input v-model="sfForm.textRequired" placeholder="请输入必填文本" clearable />
          </el-form-item>
        </el-col>
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="option" label="选项">
            <el-select v-model="sfForm.option" placeholder="请选择选项" filterable clearable>
              <el-option label="选项1" value="value1" />
              <el-option label="选项2" value="value2" />
              <el-option label="选项3" value="value3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="optionRange" label="多选">
            <el-select
              v-model="sfForm.optionRange"
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
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="date" label="日期">
            <el-date-picker
              v-model="sfForm.date"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="dateRange" label="日期范围">
            <el-date-picker
              v-model="sfForm.dateRange"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="datetime" label="时间">
            <el-date-picker
              v-model="sfForm.datetime"
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
              v-model="sfForm.datetimeRange"
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
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="num" label="数字">
            <el-input-number
              v-model="sfForm.num"
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
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="sliderRange" label="滑块范围">
            <el-slider v-model="sfForm.sliderRange" range :show-stops="false" :step="1" :max="100" />
          </el-form-item>
        </el-col>
        <el-col class="search-filter__field" v-bind="elColProps">
          <el-form-item prop="status" label="状态">
            <DictSelect v-model="sfForm.status" :dict-list="sys_status" clearable></DictSelect>
          </el-form-item>
        </el-col>

        <!-- 按钮组 -->
        <div class="search-filter__actions">
          <el-button :icon="Search" type="primary" @click="toSearch">查询</el-button>
          <el-button :icon="RefreshLeft" @click="resetForm">重置</el-button>
          <el-button
            class="search-filter__toggle"
            :icon="isCollapsed ? ArrowDown : ArrowUp"
            :title="isCollapsed ? '展开' : '收起'"
            @click="toggleCollapsed"
          >
          </el-button>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { Search, RefreshLeft, ArrowUp, ArrowDown, Check, Close } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import type { DictContext } from '@/composables/useDict'
import type { DemoSearchForm, SearchFilterEmits } from '@/types/demo'

const emits = defineEmits<SearchFilterEmits>()

// 字典
const { sys_status } = inject<DictContext>('__DICT__')!

// 表单项响应式配置
const elColProps = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
const isCollapsed = ref(true)

// 表单
const sfForm = ref<DemoSearchForm>({
  text: '',
  textRequired: '',
  option: '',
  optionRange: [],
  date: '',
  dateRange: [],
  datetime: '',
  datetimeRange: [],
  num: 0,
  sliderRange: [25, 75],
  status: 'enabled'
})

const sfFormRef = useTemplateRef('sfFormRef')
const rules: FormRules<DemoSearchForm> = {
  textRequired: [{ required: true, message: '请输入必填文本', trigger: ['blur', 'change'] }]
}

/**
 * 切换搜索区域的折叠状态。
 */
function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value
}

/**
 * 清空搜索表单校验状态并恢复表单初始值。
 */
function resetForm() {
  sfFormRef.value?.clearValidate()
  sfFormRef.value?.resetFields()
}

/**
 * 校验搜索表单并向父页面提交查询参数。
 */
function toSearch() {
  sfFormRef.value?.validate((valid) => {
    if (valid) {
      emits('query', sfForm.value)
    } else {
      emits('reset')
    }
  })
}
</script>

<style lang="scss" scoped>
.search-filter {
  width: 100%;
}

.search-filter__actions {
  display: flex;
  justify-content: flex-end;
  margin: 0 var(--app-gap-xs) var(--app-gap-df) auto;
}

.search-filter__toggle {
  display: none;
  padding-right: 8px !important;
  padding-left: 8px !important;
}
</style>
