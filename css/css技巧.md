### 使用css复位

CSS复位可以在不同的浏览器上保持一致的样式风格。您可以使用CSS reset 库[Normalize](http://necolas.github.io/normalize.css/)等，也可以使用一个更简化的复位方法：

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

### 继承 `box-sizing`

>**box-sizing** 属性用于更改用于计算元素宽度和高度的默认的 [CSS 盒子模型](https://developer.mozilla.org/en-US/docs/CSS/Box_model)。可以使用此属性来模拟不正确支持CSS盒子模型规范的浏览器的行为。
>
>```css
>box-sizing: content-box;
>box-sizing: border-box;
>
>/* 全局 值 */
>box-sizing: inherit;
>box-sizing: initial;
>box-sizing: unset;
>```
>
>box-sizing 属性可以被用来调整这些表现:
>
>- `content-box`  是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。
>- `border-box` 告诉浏览器去理解你设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px,那么这100px会包含其它的border和padding，内容区的实际宽度会是width减去border + padding的计算值。大多数情况下这使得我们更容易的去设定一个元素的宽高。



从 `html` 元素继承 `box-sizing` ：

```css
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
```

如此在插件或其它组件里改变 `box-sizing` 变得简单。

### 使用`unset`而不是重置所有属性

重置元素的属性时，不需要重置每个单独的属性：

```css
button {
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  outline: none;
  padding: 0;
}
```

你可以用`all`简写來指定所有元素的属性。 将该值设置为`unset`会将元素的属性更改为其初始值：

```css
button {
  all: unset;
}
```

### 使用 `:not()` 选择器来决定表单是否显示边框

先为元素添加边框

```css
/* 添加边框 */
.nav li {
  border-right: 1px solid #666;
}
```

为最后一个元素去除边框

```css
/* 去掉边框 */
.nav li:last-child {
  border-right: none;
}
```

不过不要这么做，使用 `:not()` 伪类来达到同样的效果：

```css
.nav li:not(:last-child) {
  border-right: 1px solid #666;
}
```

当然，你也可以使用 `.nav li + li`，但是 `:not()` 更加清晰，具有可读性。

### 为 `body` 元素添加行高

不必为每一个 `<p>`，`<h*>` 元素逐一添加 `line-height`，直接添加到 `body` 元素：

```css
body {
  line-height: 1.5;
}
```

文本元素可以很容易地继承 `body` 的样式。

### 垂直居中任何元素

不！这绝不是黑魔法，真的可以垂直居中任何元素：

```css
html, body {
  height: 100%;
  margin: 0;
}

body {
  -webkit-align-items: center;  
  -ms-flex-align: center;  
  align-items: center;
  /*https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items*/
  display: -webkit-flex;
  display: flex;
}
```

### 逗号分隔列表

> CSS的 `content` CSS 属性用于在元素的  [`::before`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before) 和 [`::after`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after) 伪元素中插入内容。使用`content` 属性插入的内容都是匿名的*可替换元素。*

使列表的每项都由逗号分隔：

```css
ul > li:not(:last-child)::after {
  content: ",";
}
```

因最后一项不加逗号，可以使用 `:not()` 伪类。

**注意：** 这一技巧对于无障碍，特别是屏幕阅读器而言并不理想。而且复制粘贴并不会带走CSS生成的内容,需要注意。

### 使用负的 `nth-child` 来选择元素

使用负的 `nth-child` 可以选择 1 至 n 个元素。

```css
li {
  display: none;
}

/* 选择第 1 至第 3 个元素并显示出来 */
li:nth-child(-n+3) {
  display: block;
}
```

或许你已经掌握了[如何使用 `:not()`](https://github.com/AllThingsSmitty/css-protips/tree/master/translations/zh-CN#use-not-to-applyunapply-borders-on-navigation)这个技巧，试下这个：

```css
/* 选择除前3个之外的所有项目，并显示它们 */
li:not(:nth-child(-n+3)) {
  display: none;
}
```

### 使用 SVG 图标

没有理由不使用 SVG 图标：

```css
.logo {
  background: url("logo.svg");
}
```

SVG 在所有分辨率下都可以良好缩放，并且支持所有 IE9 以后的浏览器，丢掉你的 .png, .jpg, 或 .gif-jif-whatev 文件吧。

**注意：** 针对仅有图标的按钮，如果 SVG 没有加载成功的话，以下样式对无障碍有所帮助：

> CSS表达式 `attr()` 用来获取选择到的元素的某一HTML属性值，并用于其样式。它也可以用于伪元素，属性值采用伪元素所依附的元素。
>
> 例子:
>
> ```
> p:before {
>     content:attr(data-foo) " ";
> }
> ```
>
> ```
> <p data-foo="hello">world</p>
> ```
>
> 结果:
>
> hello world

```css
.no-svg .icon-only::after {
  content: attr(aria-label);
}
```

### 使用 “形似猫头鹰” 的选择器

这个名字可能比较陌生，不过通用选择器 (`*`) 和 相邻兄弟选择器 (`+`) 一起使用，效果非凡：

```css
* + * {
  margin-top: 1.5em;
}
```

在此示例中，文档流中的所有的相邻兄弟元素将都将设置 `margin-top: 1.5em` 的样式。

### 使用 `max-height` 来建立纯 CSS 的滑块

`max-height` 与 overflow hidden 一起来建立纯 CSS 的滑块：

```css
.slider {
  max-height: 200px;
  overflow-y: hidden;
  width: 300px;
}

.slider:hover {
  max-height: 600px;
  overflow-y: scroll;
}
```

鼠标移入滑块元素时增大它的 `max-height` 值，便可以显示溢出部分。

### 创造格子等宽的表格

`table-layout: fixed` 可以让每个格子保持等宽：

```
.calendar {
  table-layout: fixed;
}
```

无痛的 table 布局。

#### [演示](http://codepen.io/AllThingsSmitty/pen/jALALm)

### 利用 Flexbox 去除多余的外边距

与其使用 `nth-`， `first-`， 和 `last-child` 去除列之间多余的间隙，不如使用 flexbox 的 `space-between` 属性：

```css
.list {
  display: flex;
  justify-content: space-between;
}

.list .person {
  flex-basis: 23%;
}
```

列之间的间隙总是均匀相等。

### 利用属性选择器来选择空链接

当 `<a>` 元素没有文本内容，但有 `href` 属性的时候，显示它的 `href` 属性：

```
a[href^="http"]:empty::before {
  content: attr(href);
}
```

相当简便。

#### [演示](http://codepen.io/AllThingsSmitty/pen/zBzXRx)

### 给 “默认” 链接定义样式

给 “默认” 链接定义样式：

```css
a[href]:not([class]) {
  color: #008000;
  text-decoration: underline;
}
```

通过 CMS 系统插入的链接，通常没有 `class` 属性，以上样式可以甄别它们，而且不会影响其它样式。

### 一致垂直节奏

通用选择器 (`*`) 跟元素一起使用，可以保持一致的垂直节奏：

```css
.intro > * {
  margin-bottom: 1.25rem;
}
```

一致的垂直节奏可以提供视觉美感，增强内容的可读性。

### 固定比例盒子

要创建具有固定比例的一个盒子，所有你需要做的就是给 div 设置一个 padding：

```css
.container {
  height: 0;
  padding-bottom: 20%;
  position: relative;
}

.container div {
  border: 2px dashed #ddd;	
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
```

使用20％的padding-bottom使得框等于其宽度的20％的高度。与视口宽度无关，子元素的div将保持其宽高比（100％/ 20％= 5:1）。

### 为破碎图象定义样式

只要一点CSS就可以美化破碎的图象：

```css
img {  
  display: block;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 300;
  height: auto;
  line-height: 2;
  position: relative;
  text-align: center;
  width: 100%;
}
```

以添加伪元素的法则来显示用户信息和URL的引用：

```css
img::before {  
  content: "We're sorry, the image below is broken :(";
  display: block;
  margin-bottom: 10px;
}

img::after {  
  content: "(url: " attr(src) ")";
  display: block;
  font-size: 12px;
}
```

### 用 `rem` 来调整全局大小；用 `em` 来调整局部大小

在根元素设置基本字体大小后 (`html { font-size: 100%; }`), 使用 `em` 设置文本元素的字体大小:

```css
h2 { 
  font-size: 2em;
}

p {
  font-size: 1em;
}
```

然后设置模块的字体大小为 `rem`:

```css
article {
  font-size: 1.25rem;
}

aside .module {
  font-size: .9rem;
}
```

现在，每个模块变得独立，更容易、灵活的样式便于维护。

> em是相对长度单位。相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。 
>
> rem是[CSS3](http://www.html5cn.org/portal.php?mod=list&catid=16)新增的一个相对单位（root em，根em），这个单位引起了广泛关注。这个单位与em有什么区别呢？区别在于使用rem为元素设定字体大小时，仍然是相对大小，但相对的只是HTML根元素。这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。

> - `px` 在缩放页面时无法调整那些使用它作为单位的字体、按钮等的大小；
> - `em` 的值并不是固定的，会继承父级元素的字体大小，代表倍数；
> - `rem` 的值并不是固定的，始终是基于根元素 `<html>` 的，也代表倍数。

### 隐藏没有静音、自动播放的影片

这是一个自定义用户样式表的不错的技巧。避免在加载页面时自动播放。如果没有静音，则不显示视频：

> **muted**
>
> 布尔属性，指明了视频里的音频的默认设置。设置后，音频会初始化为静音。默认值是false,意味着视频播放的时候音频也会播放 。

```css
video[autoplay]:not([muted]) {
  display: none;
}
```

再次，我们利用了 [`:not()`](https://github.com/AllThingsSmitty/css-protips/tree/master/translations/zh-CN#use-not-to-applyunapply-borders-on-navigation) 的优点。

### 使用选择器`:root`来控制字体弹性

在响应式布局中，字体大小应需要根据不同的视口进行调整。你可以计算字体大小根据视口高度的字体大小和宽度，这时需要用到`:root`:

```css
:root {
  font-size: calc(1vw + 1vh + .5vmin);
}
```

现在，您可以使用 `root em`

```css
body {
  font: 1rem/1.6 sans-serif;
}
```

### 为更好的移动体验，为表单元素设置字体大小

当触发`<select>`的下拉列表时，为了避免表单元素在移动浏览器（IOS Safari 等等）上的缩放，加上`font-size`：

```css
input[type="text"],
input[type="number"],
select,
textarea {
  font-size: 16px;
}
```

### 使用指针事件來控制鼠标事件

[指针事件](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)允許您指定鼠标如何与其触摸的元素进行交互。 要禁用按钮上的默认指针事件，例如：

```css
.button-disabled {
  opacity: .5;
  pointer-events: none;
}
```