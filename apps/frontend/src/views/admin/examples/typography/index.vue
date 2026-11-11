<template>
  <section class="flex max-w-3xl flex-col gap-6 py-2">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold tracking-tight">排版展示</h1>
      <p class="text-sm text-muted-foreground">二级页面示例 · 页面示例 / 排版展示</p>
    </div>
    <article class="flex flex-col gap-6 rounded-xl border p-6 sm:p-8">
      <div class="flex flex-col gap-3">
        <p class="text-xs font-medium tracking-widest text-muted-foreground">
          FULL STACK / DESIGN NOTES
        </p>
        <h2 class="text-xl font-semibold tracking-tight">让内容拥有清晰的层次</h2>
        <p class="text-sm leading-7 text-muted-foreground">
          标题用于建立页面结构，正文用于传递信息。适当的留白与稳定的行距，可以让不同宽度下的阅读体验保持一致。
        </p>
      </div>
      <Separator />
      <div class="flex flex-col gap-3">
        <h3 class="font-medium">内容组织建议</h3>
        <ul class="flex list-disc flex-col gap-2 pl-5 text-sm leading-7 text-muted-foreground">
          <li>每个页面保留一个清晰的主标题。</li>
          <li>用分组和小标题组织相关内容。</li>
          <li>长篇内容限制阅读宽度，避免文字横跨整个屏幕。</li>
        </ul>
      </div>
      <blockquote class="border-l-2 pl-4 text-sm leading-7 text-muted-foreground">
        布局提供稳定的框架，内容决定页面的价值。
      </blockquote>
    </article>
    <div>
      <ElButton :tag="RouterLink" :to="{ name: 'admin-buttons' }">返回按钮交互</ElButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { ElButton } from 'element-plus'
import { Separator } from '@/components/ui/separator'
</script>

<style lang="scss" scoped></style>
