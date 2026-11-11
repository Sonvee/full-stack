<template>
  <main class="flex min-h-svh bg-background text-foreground">
    <div class="flex w-full flex-col gap-4 p-6 md:p-10 lg:w-1/2">
      <div class="flex justify-center md:justify-start">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-2 rounded-md font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span
            class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <i class="sv-icon-logo text-base leading-none" />
          </span>
          Full Stack
        </RouterLink>
      </div>

      <div class="flex flex-1 items-center justify-center py-12">
        <form
          class="w-full max-w-xs"
          @submit.prevent="showLoginNotice = true"
        >
          <FieldGroup>
            <div class="flex flex-col items-center gap-2 text-center">
              <h1 class="text-2xl font-bold">登录你的账号</h1>
              <p class="text-sm text-balance text-muted-foreground">欢迎回来，请输入邮箱和密码</p>
            </div>

            <Field>
              <FieldLabel for="login-email">邮箱</FieldLabel>
              <ElInput
                v-model="email"
                id="login-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autocomplete="username"
                autocapitalize="none"
                :spellcheck="false"
                required
              />
            </Field>

            <Field>
              <FieldLabel for="login-password">密码</FieldLabel>
              <ElInput
                v-model="password"
                id="login-password"
                name="password"
                type="password"
                placeholder="请输入密码"
                autocomplete="current-password"
                required
              />
            </Field>

            <Field>
              <ElButton native-type="submit" type="primary">登录</ElButton>
              <FieldDescription>
                {{ showLoginNotice ? '登录服务尚未接入，暂时无法登录。你可以先预览管理端。' : '' }}
              </FieldDescription>
            </Field>

            <FieldSeparator>或先体验</FieldSeparator>

            <Field>
              <ElButton :tag="RouterLink" :to="{ name: 'admin-dashboard' }">预览管理端</ElButton>
              <FieldDescription class="text-center">无需登录即可查看演示页面</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>

    <div class="relative hidden w-1/2 bg-muted lg:block">
      <img
        src="https://devtool.tech/api/placeholder/1440/1920"
        alt=""
        class="absolute inset-0 size-full object-cover"
      />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { ElButton, ElInput } from 'element-plus'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'

const email = shallowRef('')
const password = shallowRef('')
const showLoginNotice = shallowRef(false)
</script>

<style lang="scss" scoped></style>
