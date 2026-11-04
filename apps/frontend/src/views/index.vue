<template>
  <main class="home">
    <section class="demo-card" aria-labelledby="demo-title">
      <span class="demo-card__badge">Sass / SCSS</span>
      <h1 id="demo-title" class="demo-card__title">给首页添一点颜色。</h1>
      <p class="demo-card__description">
        这是一个简单的 Sass 示例：用变量统一颜色，用嵌套组织样式。
      </p>
      <ul class="demo-card__features" aria-label="本页使用的 Sass 语法">
        <li>$变量</li>
        <li>嵌套选择器</li>
        <li>&amp;:hover</li>
      </ul>
      <details class="demo-card__example">
        <summary class="demo-card__toggle">查看 SCSS 写法</summary>
        <pre class="demo-card__code"><code>$primary: #087f5b;

.demo-card {
  &amp;__toggle {
    background: $primary;

    &amp;:hover {
      background: #065f46;
    }
  }
}</code></pre>
      </details>
    </section>
  </main>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
// 修改这个变量，徽标和按钮会一起更换主题色。
$primary: #087f5b;
$primary-hover: #065f46;
$text: #16352b;
$muted: #52665f;
$border: #dbe9e2;

.home {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100svh - 16px);
  padding: clamp(24px, 5vw, 64px);
  background: #f0f7f3;
  color: $text;
  font-family: system-ui, sans-serif;
  line-height: 1.7;
}

.demo-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 640px;
  padding: clamp(24px, 5vw, 48px);
  border: 1px solid $border;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 16px 48px rgba($primary, 0.08);

  // & 代表外层选择器，这里编译为 .demo-card__badge。
  &__badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 8px;
    background: rgba($primary, 0.08);
    color: $primary;
    font-size: 14px;
    font-weight: 600;
  }

  &__title {
    margin: 24px 0 12px;
    font-size: clamp(28px, 5vw, 40px);
    line-height: 1.3;
  }

  &__description {
    margin: 0;
    color: $muted;
    font-size: 16px;
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    margin: 24px 0;
    padding-left: 20px;
    color: $muted;
    font-size: 14px;
  }

  &__toggle {
    box-sizing: border-box;
    width: fit-content;
    min-height: 44px;
    padding: 10px 18px;
    border-radius: 10px;
    background: $primary;
    color: #fff;
    cursor: pointer;
    transition: background-color 160ms ease;

    &:hover {
      background: $primary-hover;
    }

    &:focus-visible {
      outline: 3px solid $primary;
      outline-offset: 4px;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &__code {
    overflow-x: auto;
    margin: 20px 0 0;
    padding: 20px;
    border: 1px solid $border;
    border-radius: 12px;
    background: #f5f9f6;
    font-size: 14px;
    line-height: 1.6;
  }
}
</style>
