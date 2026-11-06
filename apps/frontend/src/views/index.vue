<template>
  <div class="flex min-h-svh flex-col bg-emerald-50/60 font-sans text-emerald-950">
    <header
      class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 sm:px-10"
    >
      <span class="text-lg font-bold tracking-tight">Full Stack</span>
      <span class="text-sm text-emerald-800">你的下一个起点<i class="sv-icon-logo"></i></span>
    </header>

    <main class="flex flex-1 items-center px-6 py-12 sm:px-10 sm:py-20">
      <section aria-labelledby="welcome-title" class="mx-auto w-full max-w-5xl">
        <div
          class="flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <div class="min-w-0 max-w-2xl">
            <p class="mb-6 text-sm font-medium text-emerald-700">欢迎来到你的全栈项目</p>
            <h1
              id="welcome-title"
              class="text-5xl leading-tight font-semibold tracking-tight break-words sm:text-7xl"
            >
              从这里，<br />
              <span class="text-emerald-600">让想法发生。</span>
            </h1>
            <p class="mt-8 max-w-lg text-base leading-8 text-emerald-900/70 sm:text-lg">
              用 Vue 构建交互，用 Tailwind CSS 描绘界面。下一次精彩，从你的第一行代码开始。
            </p>
            <div class="mt-10 flex flex-wrap gap-4">
              <a
                href="https://tailwindcss.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
              >
                探索 Tailwind CSS
              </a>
              <a
                href="https://cn.vuejs.org/guide/introduction.html"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-800/20 bg-white px-6 py-3 text-sm font-semibold hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
              >
                阅读 Vue 文档
              </a>
            </div>
          </div>

          <aside
            aria-label="项目技术栈"
            class="w-full border-t border-emerald-900/15 pt-6 lg:w-52 lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          >
            <p class="mb-5 text-sm text-emerald-800">构建你的下一步</p>
            <ul class="flex flex-wrap gap-x-6 gap-y-4 text-lg font-medium lg:flex-col">
              <li>Vue 3</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>

    <footer
      class="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-3 px-6 py-8 text-xs text-emerald-900/60 sm:px-10"
    >
      <span>保持好奇，开始创造。</span>
      <span>Built with Vue &amp; Tailwind CSS</span>
    </footer>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
