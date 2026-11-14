<template>
  <main class="flex min-h-svh bg-background text-foreground">
    <div class="flex w-full flex-col gap-4 p-6 md:p-10 lg:w-1/2">
      <div class="flex justify-center md:justify-start">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-2 rounded-md font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <i class="sv-icon-logo text-base leading-none" />
          </span>
          Full Stack
        </RouterLink>
      </div>

      <div class="flex flex-1 items-center justify-center py-12">
        <div class="flex w-full max-w-xs flex-col gap-6">
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-2xl font-bold">登录你的账号</h1>
            <p class="text-sm text-balance text-muted-foreground">欢迎回来，请输入邮箱和密码</p>
          </div>

          <el-form ref="formRef" :model="formData" :rules="rules" label-position="top" hide-required-asterisk>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                name="email"
                type="email"
                clearable
                placeholder="name@example.com"
                autocomplete="username"
                autocapitalize="none"
                :spellcheck="false"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                name="password"
                type="password"
                clearable
                show-password
                placeholder="请输入密码"
                autocomplete="current-password"
              />
            </el-form-item>

            <el-form-item class="mb-0!">
              <el-button type="primary" class="w-full" @click="toLogin">登录</el-button>
            </el-form-item>
          </el-form>

          <el-divider class="my-0!">或先体验</el-divider>

          <div class="flex flex-col gap-2">
            <el-button :tag="RouterLink" :to="{ name: 'admin-dashboard' }">预览管理端</el-button>
            <p class="text-center text-sm text-muted-foreground">无需登录即可查看演示页面</p>
          </div>
        </div>
      </div>
    </div>

    <div class="relative hidden w-1/2 bg-muted lg:block">
      <img src="https://devtool.tech/api/placeholder/1440/1920" alt="" class="absolute inset-0 size-full object-cover" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { reactive, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'

const formRef = useTemplateRef('formRef')
const formData = reactive({ email: '', password: '' })

const rules: FormRules<typeof formData> = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

/** 校验通过后显示登录服务的接入状态。 */
function toLogin() {
  void formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.info('登录服务尚未接入，暂时无法登录。你可以先预览管理端。')
    }
  })
}
</script>

<style lang="scss" scoped></style>
