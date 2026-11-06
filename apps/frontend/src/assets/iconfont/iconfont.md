### 使用方式

1. 粘贴并覆盖本目录下 `iconfont.css` 和 `iconfont.ttf` 文件

2. 修改 `iconfont.css` 部分代码如下：

```css
@font-face {
  font-family: 'sv-icon';
  src: url('./iconfont.ttf') format('truetype');
  font-style: normal;
}

[class*='sv-icon-'],
[class^='sv-icon-'] {
  font-family: 'sv-icon' !important;
  font-style: normal;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```