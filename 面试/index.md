# HTML

## DOCTYPE和浏览器渲染模式

文档类型，一个文档类型标记是一种标准通用标记语言的文档类型声明，它的目的是要告诉标准通用标记语言解析器，它应该使用什么样的文档类型定义（DTD）来解析文档。Doctype还会对浏览器的渲染模式产生影响，不同的渲染模式会影响到浏览器对于 CSS 代码甚至 JavaScript 脚本的解析，所以Doctype是非常关键的，尤其是在 IE 系列浏览器中，由DOCTYPE 所决定的 HTML 页面的渲染模式至关重要。

浏览器解析HTML方式
有三种解析方式:

- 非怪异（标准）模式
- 怪异模式
- 部分怪异（近乎标准）模式

在“标准模式”(standards mode) 页面按照 HTML 与 CSS 的定义渲染，而在“怪异模式(quirks mode) 模式”中则尝试模拟更旧的浏览器的行为。 一些浏览器（例如，那些基于 Mozilla 的 Gecko 渲染引擎的，或者 Internet Explorer 8 在 strict mode 下）也使用一种尝试于这两者之间妥协的“近乎标准”(almost standards) 模式，实施了一种表单元格尺寸的怪异行为，除此之外符合标准定义。

一个不含任何 DOCTYPE 的网页将会以 怪异(quirks) 模式渲染。

HTML5提供的 `<DOCTYPE html>` 是标准模式，向后兼容的, 等同于开启了标准模式，那么浏览器就得老老实实的按照W3C的 标准解析渲染页面，这样一来，你的页面在所有的浏览器里显示的就都是一个样子了。

## 盒模型

盒模型(box model)是CSS中的一个重要概念，它是元素大小的呈现方式。需要记住的是："every element in web design is a rectangular box"。如图：

![box-model](https://leohxj.gitbooks.io/front-end-database/html-and-css-basic/assets/box-model.svg)

CSS3中新增了一种盒模型计算方式：`box-sizing`熟悉。盒模型默认的值是`content-box`, 新增的值是`padding-box`和`border-box`，几种盒模型计算元素宽高的区别如下：

**content-box（默认）**

布局所占宽度Width：

`Width = width + padding-left + padding-right + border-left + border-right`

布局所占高度Height:

`Height = height + padding-top + padding-bottom + border-top + border-bottom`

**padding-box**

布局所占宽度Width：

`Width = width(包含padding-left + padding-right) + border-top + border-bottom`

布局所占高度Height:

`Height = height(包含padding-top + padding-bottom) + border-top + border-bottom`

**border-box**

布局所占宽度Width：

`Width = width(包含padding-left + padding-right + border-left + border-right)`

布局所占高度Height:

`Height = height(包含padding-top + padding-bottom + border-top + border-bottom)`

**margin叠加**

外边距叠加是一个相当简单的概念。 但是，在实践中对网页进行布局时， 它会造成许多混淆。 简单的说， 当两个或更多个垂直边距相遇时， 它们将形成一个外边距。这个外边距的高度等于两个发生叠加的外边距的高度中的较大者。但是注意只有普通文档流中块框的垂直外边距才会发生外边距叠加。 行内框、 浮动框或绝对定位框之间的外边距不会叠加。

一般来说， 垂直外边距叠加有三种情况：

- 元素自身叠加 当元素没有内容（即空元素）、内边距、边框时， 它的上下边距就相遇了， 即会产生叠加（垂直方向）。 当为元素添加内容、 内边距、 边框任何一项， 就会取消叠加。
- 相邻元素叠加 相邻的两个元素， 如果它们的上下边距相遇，即会产生叠加。
- 包含（父子）元素叠加 包含元素的外边距隔着 父元素的内边距和边框， 当这两项都不存在的时候， 父子元素垂直外边距相邻， 产生叠加。 添加任何一项即会取消叠加。



# css

## 说说样式权重的优先级;

`!important` > 行内样式 > `id` > `class` > `tag`

样式权重可以叠加, 比如 `id>class`

## CSS隐藏元素的几种方式及区别

**display:none**

- 元素在页面上将彻底消失，元素本来占有的空间就会被其他元素占有，也就是说它会导致浏览器的重排和重绘。
- 不会触发其点击事件

**visibility:hidden**

- 和`display:none`的区别在于，`元素在页面消失后，其占据的空间依旧会保留着`，所以它`只会导致浏览器重绘`而不会重排。
- 无法触发其点击事件
- 适用于那些元素隐藏后不希望页面布局会发生变化的场景

**opacity:0**

- 将元素的透明度设置为0后，在我们用户眼中，元素也是隐藏的，这算是一种隐藏元素的方法。
- 和`visibility:hidden`的一个共同点是元素隐藏后依旧占据着空间，但我们都知道，设置透明度为0后，元素只是隐身了，它依旧存在页面中。
- 可以触发点击事件

**设置height，width等盒模型属性为0**

- 简单说就是将元素的`margin`，`border`，`padding`，`height`和`width`等影响元素盒模型的属性设置成`0`，如果元素内有子元素或内容，还应该设置其`overflow:hidden`来隐藏其子元素，这算是一种奇技淫巧。
- 如果元素设置了border，padding等属性不为0，很显然，页面上还是能看到这个元素的，触发元素的点击事件完全没有问题。如果全部属性都设置为0，很显然，这个元素相当于消失了，即无法触发点击事件。
- 这种方式既不实用，也可能存在着着一些问题。但平时我们用到的一些页面效果可能就是采用这种方式来完成的，比如jquery的slideUp动画，它就是设置元素的overflow:hidden后，接着通过定时器，不断地设置元素的height，margin-top，margin-bottom，border-top，border-bottom，padding-top，padding-bottom为0，从而达到slideUp的效果。

**其他脑洞方法**

- 设置元素的position与left，top，bottom，right等，将元素移出至屏幕外
- 设置元素的position与z-index，将z-index设置成尽量小的负数

## position 几个属性的作用

position 的常见四个属性值: relative，absolute，fixed，static。一般都要配合"left"、"top"、"right" 以及 "bottom" 属性使用。

- **static:默认位置**，在一般情况下，我们不需要特别的去声明它，但有时候遇到继承的情况，我们不愿意见到元素所继承的属性影响本身，从而可以用Position:static取消继承，即还原元素定位的默认值。设置为 static 的元素，它始终会处于页面流给予的位置(static 元素会忽略任何 top、 bottom、left 或 right 声明)。一般不常用。
- **relative:相对定位**，相对定位是相对于元素默认的位置的定位，它偏移的 top，right，bottom，left 的值都以它原来的位置为基准偏移，而不管其他元素会怎么 样。注意 relative 移动后的元素在原来的位置仍占据空间。
- **absolute:绝对定位**，设置为 absolute 的元素，如果它的 父容器设置了 position 属性，并且 position 的属性值为 absolute 或者 relative，那么就会依据父容器进行偏移。如果其父容器没有设置 position 属性，那么偏移是以 body 为依据。注意设置 absolute 属性的元素在标准流中不占位置。
- **fixed:固定定位**，位置被设置为 fixed 的元素，可定位于相对于浏览器窗口的指定坐标。不论窗口滚动与否，元素都会留在那个位置。它始终是以 body 为依据的。 注意设置 fixed 属性的元素在标准流中不占位置。

## 渐进增强和优雅降级

关键的区别是他们所侧重的内容，以及这种不同造成的工作流程的差异

- **优雅降级**一开始就构建完整的功能，然后再针对低版本浏览器进行兼容。。
- **渐进增强**针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

区别：

- 优雅降级是从复杂的现状开始，并试图减少用户体验的供给
- 渐进增强则是从一个非常基础的，能够起作用的版本开始，并不断扩充，以适应未来环境的需要
- 降级（功能衰减）意味着往回看；而渐进增强则意味着朝前看，同时保证其根基处于安全地带

## CSS 有哪些样式可以给子元素继承

- 可继承的:font-size,font-weight,line-height,color,cursor等
- 不可继承的一般是会改变盒子模型的:display,margin、border、padding、height等

## 行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？

- 行内: `input`,`span`,`a`,`img`以及`display:inline`的元素
- 块级: `p`,`div`,`header`,`footer`,`aside`,`article`,`ul`以及`display:block`这些
- void: `br`,`hr`

## 清除浮动的方式有哪些?比较好的是哪一种?

常用的一般为三种`.clearfix`, `clear:both`,`overflow:hidden`;

比较好是 `.clearfix`,伪元素万金油版本...后两者有局限性..等会再扯

```
    .clearfix:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
    }
    
    
<!--
为毛没有 zoom ,_height 这些...IE6,7这类需要 csshack 不再我们考虑之内了
.clearfix 还有另外一种写法...
-->

.clearfix:before, .clearfix:after {
	content:"";
	display:table;
}
.clearfix:after{
	clear:both;
	overflow:hidden;
}
.clearfix{
    zoom:1;
}

<!--
用display:table 是为了避免外边距margin重叠导致的margin塌陷,
内部元素默认会成为 table-cell 单元格的形式
-->
    
```

`clear:both`:若是用在同一个容器内相邻元素上,那是贼好的...有时候在容器外就有些问题了, 比如相邻容器的包裹层元素塌陷

`overflow:hidden`:这种若是用在同个容器内,可以形成 `BFC`避免浮动造成的元素塌陷

## css3新特性

https://juejin.im/post/5a0c184c51882531926e4294

### css3选择器

css3提供的选择器可以让我们的开发，下面是css3提供的选择器。

![img](https://user-gold-cdn.xitu.io/2017/11/15/15fbf40815f2e26b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

图片来自w3c。（[CSS 选择器参考手册](https://link.juejin.im/?target=http%3A%2F%2Fwww.w3school.com.cn%2Fcssref%2Fcss_selectors.asp)）

# BFC

https://juejin.im/post/59b73d5bf265da064618731d

BFC全称是Block Formatting Context，即块格式化上下文。它是CSS2.1规范定义的，关于CSS渲染定位的一个概念。要明白BFC到底是什么，首先来看看什么是视觉格式化模型。



## 三个定位方案

在定位的时候，浏览器就会根据元素的盒类型和上下文对这些元素进行定位，可以说盒就是定位的基本单位。定位时，有三种定位方案，分别是常规流，浮动已经绝对定位。
常规流(Normal flow)

在常规流中，盒一个接着一个排列;
在块级格式化上下文里面， 它们竖着排列；
在行内格式化上下文里面， 它们横着排列;
当position为static或relative，并且float为none时会触发常规流；
对于静态定位(static positioning)，position: static，盒的位置是常规流布局里的位置；
对于相对定位(relative positioning)，position: relative，盒偏移位置由这些属性定义top，bottom，leftandright。即使有偏移，仍然保留原有的位置，其它常规流不能占用这个位置。

浮动(Floats)

盒称为浮动盒(floating boxes)；
它位于当前行的开头或末尾；
这导致常规流环绕在它的周边，除非设置 clear 属性；

绝对定位(Absolute positioning)

绝对定位方案，盒从常规流中被移除，不影响常规流的布局；
它的定位相对于它的包含块，相关CSS属性：top，bottom，left及right；
如果元素的属性position为absolute或fixed，它是绝对定位元素；
对于position: absolute，元素定位将相对于最近的一个relative、fixed或absolute的父元素，如果没有则相对于body；

## 各种居中以及常规布局

https://github.com/Sweet-KK/css-layout

##  viewport—网页自适应移动 app 神器

https://juejin.im/entry/58e750a02f301e0062367ded

## 双飞翼和圣杯布局的差异

https://www.zhihu.com/question/21504052

# JavaScript

## `null`和`undefined`的差异

大体说一下,想要知其所以然请引擎搜索

相同点:

- 在 `if`判断语句中,值都默认为 `false`
- 大体上两者都是代表**无**,具体看差异

差异:

- `null`转为数字类型值为0,而`undefined`转为数字类型为 `NaN(Not a Number)`
- `undefined`是代表调用一个值而该值却没有赋值,这时候默认则为`undefined`
- `null`是一个很特殊的对象,最为常见的一个用法就是作为参数传入(说明该参数不是对象)
- 设置为`null`的变量或者对象会被内存收集器回收
- null表示"没有对象"，即该处不应该有值。undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义。

null是一个表示"无"的对象，转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。

## 对数组 ['2018-03-05', '2013-06-12','2019-03-12','2018-03-05','2014-02-22'] 去重且排序

1. ES6 set

```
//很好理解, Set 具有值唯一性(但不是所有值,等会我抛出我的另外一篇文章)
// 结合...解构,可以把可迭代(比如 arguments/nodelist 等)的转为数组
// sort 里面传入 两个值比较,返回-1和1是因为1代表这个数大排后(相对),-1代表小(相对),0为相等

let arr = [...new Set(['2018-03-05', '2013-06-12','2019-03-12','2018-03-05','2014-02-22'])].sort(function(a,b){
  return a<b ? -1:1; // 这里返回的是升序的,降序改下返回值就好了.所以是相对
})

// ["2013-06-12", "2014-02-22", "2018-03-05", "2019-03-12"]
```

2. 遍历，将值添加到新数组，用indexOf()判断值是否存在，已存在就不添加，达到去重效果。

```
let a = ['1','2','3',1,NaN,NaN,undefined,undefined,null,null, 'a','b','b'];

    let unique= arr =>{

         let newA=[];

        arr.forEach(key => {

           if( newA.indexOf(key)<0 ){ //遍历newA是否存在key，如果存在key会大于0就跳过push的那一步

             newA.push(key);

           }

        });

        return newA;

    }

    console.log(unique(a)) ;//["1", "2", "3", 1, NaN, NaN, undefined, null, "a", "b"]

//ps:这个方法不能分辨NaN,会出现两个NaN。是有问题的，下面那个方法好一点。

```

3. 遍历，将数组的值添加到一个对象的属性名里，并给属性赋值，对象不能添加相同属性名，以这个为依据可以实现数组去重，然后用Object.keys(对象)返回这个对象可枚举属性组成的数组，这个数组就是去重后的数组。

    ``` 
let a = ['1', '2', '3', 1,NaN,NaN,undefined,undefined,null,null, 'a', 'b', 'b'];

    const unique = arr => {

        var obj = {}

        arr.forEach(value => {

            obj[value] = 0;//这步新添加一个属性，并赋值，如果不赋值的话，属性会添加不上去

        })

        return Object.keys(obj);//Object.keys(对象)返回这个对象可枚举属性组成的数组，这个数组就是去重后的数组

    }

    console.log(unique(a));//["1", "2", "3", "NaN", "undefined", "null", "a", "b"]

    ```



注意：
这个方法会将 number,NaN,undefined,null，变为字符串形式，因为对象的属性名就是一个字符串，根据需求来吧，想想还是Set去重最简单也最有效。

## JS 实现`String.trim()`方法;

```
// 原生是有 trim()方法的.我们要模拟一个;

String.prototype.emuTrim = function(){
    // 这条正则很好理解,就是把头部尾部多余的空格字符去除
    return this.replace(/(^\s*)|(\s*$)/g,'');
}
```

## 实现对一个数组或者对象的浅拷贝和"深度"拷贝

浅拷贝就是把属于源对象的值都复制一遍到新的对象,不会开辟两者独立的内存区域;

深度拷贝则是完完全全两个独立的内存区域,互不干扰

- 浅拷贝

```
// 这个 ES5的

function shallowClone(sourceObj) {
  // 先判断传入的是否为对象类型
  if (!sourceObj || typeof sourceObj !== 'object') {
    console.log('您传入的不是对象!!')
  }
  // 判断传入的 Obj是类型,然后给予对应的赋值
  var targetObj = sourceObj.constructor === Array ? [] : {};
  
  // 遍历所有 key
  for (var keys in sourceObj) {
    // 判断所有属于自身原型链上的 key,而非继承(上游 )那些
    if (sourceObj.hasOwnProperty(keys)) {
      // 一一复制过来
      targetObj[keys] = sourceObj[keys];
    }
  }
  return targetObj;
}

 // ES6 可以用 Object.assign(targeObj, source1,source2,source3) 来实现对象浅拷贝
 
```

- 深度拷贝

```
// 就是把需要赋值的类型转为基本类型(字符串这些)而非引用类型来实现
// JOSN对象中的stringify可以把一个js对象序列化为一个JSON字符串，parse可以把JSON字符串反序列化为一个js对象

var deepClone = function(sourceObj) {
  if (!sourceObj || typeof sourceObj !== 'object') {
    console.log('您传入的不是对象!!');
    return;
  }
  // 转->解析->返回一步到位
  return window.JSON
    ? JSON.parse(JSON.stringify(sourceObj))
    : console.log('您的浏览器不支持 JSON API');
};
```

- [深拷贝的考虑点实际上要复杂的多,详情看看知乎怎么说](https://link.juejin.im?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F33489557)

## 描述下cookie,sessionStorage,localSotrage的差异

cookie : 大小4KB 左右,跟随请求(请求头),会占用带宽资源,但是若是用来判断用户是否在线这些挺方便
sessionStorage和localStorage大同小异,大小看浏览器支持,一般为5MB,数据只保留在本地,不参与服务端交互.

- sessionStorage的生存周期只限于会话中,关闭了储存的数据就没了.
- localStorage则保留在本地,没有人为清除会一直保留

## javascript里面的继承怎么实现，如何避免原型链上面的对象共享

我在写的时候,用了两种,一个是 ES5和 ES6的方案

ES5:寄生组合式继承:通过借用构造函数来继承属性和原型链来实现子继承父。


    function ParentClass(name) {
      this.name = name;
    }
    ParentClass.prototype.sayHello = function () {
      console.log("I'm parent!" + this.name);
    }
    function SubClass(name, age) {
      //若是要多个参数可以用apply 结合 ...解构
      ParentClass.call(this, name);
      this.age = age;
    }
    SubClass.prototype = Object.create(ParentClass.prototype);
    SubClass.prototype.constructor = SubClass;
    SubClass.prototype.sayChildHello = function (name) {
      console.log("I'm child " + this.name)
    }
    
    let testA = new SubClass('CRPER')
    
    // Object.create()的polyfill
    /*
    function pureObject(o){
        //定义了一个临时构造函数
         function F() {}
         //将这个临时构造函数的原型指向了传入进来的对象。
         F.prototype = obj;
         //返回这个构造函数的一个实例。该实例拥有obj的所有属性和方法。
         //因为该实例的原型是obj对象。
         return new F();
    }
    */


ES6: 其实就是ES5的语法糖,不过可读性很强..

    class ParentClass {
      constructor(name) {
        this.name = name;
      }
      sayHello() {
        console.log("I'm parent!" + this.name);
      }
    }
    
    class SubClass extends ParentClass {
      constructor(name) {
        super(name);
      }
      sayChildHello() {
        console.log("I'm child " + this.name)
      }
      // 重新声明父类同名方法会覆写,ES5的话就是直接操作自己的原型链上
      sayHello(){
        console.log("override parent method !,I'm sayHello Method")
      }
    }
    
    let testA = new SubClass('CRPER')

## 如何判断一个变量是对象还是数组？

判断数组和对象分别都有好几种方法，其中用`prototype.toString.call()`兼容性最好。

```
function isObjArr(value){
     if (Object.prototype.toString.call(value) === "[object Array]") {
            console.log('value是数组');
       }else if(Object.prototype.toString.call(value)==='[object Object]'){//这个方法兼容性好一点
            console.log('value是对象');
      }else{
          console.log('value不是数组也不是对象')
      }
}
```

## 闭包

闭包是函数和声明该函数的词法环境的组合。

 

# redux

# react

# 其他

## SEO

seo原理:

- 页面抓取： 蜘蛛向服务器请求页面，获取页面内容
- 分析入库：对获取到的内容进行分析，对优质页面进行收录
- 检索排序：当用户检索关键词时，从收录的页面中按照一定的规则进行排序，并返回给用户结果

经过多年的搜索引擎算法的调整，现在较重要的影响标签为：

- <title>
- <meta>
- <h1>
- <img>中的 alt属性

这里是一些搜索引擎认为适当的方法：

- 在每页使用一个短、独特和相关的标题。
- 编辑网页，用与该页的主题。有关的具体术语替换隐晦的字眼。这有助于该站诉求的观众群，在搜索引擎上搜索而被正确导引至该站。
- 在该站点增加相当数量的原创内容。
- 使用合理大小、准确描述的汇标，而不过度使用关键字、惊叹号、或不相关标题术语。
- 注意网址字眼，有助于搜索引擎优化。
- 确认所有页可通过正常的链接来访问，而非只能通过[Java](https://zh.wikipedia.org/wiki/Java) 、[JavaScript](https://zh.wikipedia.org/wiki/JavaScript)或[Adobe Flash](https://zh.wikipedia.org/wiki/Adobe_Flash)应用程序访问。这可通过使用一个专属列出该站所有内容的网页达成（[网站地图](https://zh.wikipedia.org/wiki/%E7%B6%B2%E7%AB%99%E5%9C%B0%E5%9C%96)）
- 通过自然方式开发链接：Google不花功夫在这有点混淆不清的指南上。写封电子邮件给网站员，告诉他：您刚刚贴了一篇挺好的文章，并且请求链接，这种做法很可能为搜索引擎所认可。
- 参与其他网站的网络集团（译按：[web ring](https://zh.wikipedia.org/w/index.php?title=Web_ring&action=edit&redlink=1) 指的是有相同主题的结盟站群）──只要其它网站是独立的、分享同样题目和可比较的品质。

https://www.cnblogs.com/EnSnail/p/5671345.html

## 响应状态码

上面提到响应状态码，在这里也简单写下。在前端方面，请求接口可能会接触到各种情况，常见的有下面几个，应该怎么解决，就是具体问题，具体分析。

| 状态码 | 意义                                           |
| ------ | ---------------------------------------------- |
| 200    | 请求成功                                       |
| 400    | 参数错误                                       |
| 403    | 拒绝或者禁止访问（无权限访问）                 |
| 404    | 地址不存在                                     |
| 405    | 客户端请求中的方法被禁止（一般是请求方式错误） |
| 500    | 服务器报错                                     |
| 502    | 请求超时，无效网关                             |
| 503    | 服务器超载或者维护，无法响应                   |

参考资料 : [HTTP状态码](http://www.runoob.com/http/http-status-codes.html)

## 三次握手四次挥手

https://github.com/jawil/blog/issues/14

## 跨域资源共享（CORS）

普通跨域请求：只服务端设置Access-Control-Allow-Origin即可，前端无须设置，若要带cookie请求：前后端都需要设置。

需注意的是：由于同源策略的限制，所读取的cookie为跨域请求接口所在域的cookie，而非当前页。如果想实现当前页cookie的写入，可参考下文：七、nginx反向代理中设置proxy_cookie_domain 和 八、NodeJs中间件代理中cookieDomainRewrite参数的设置。

目前，所有浏览器都支持该功能(IE8+：IE8/9需要使用XDomainRequest对象来支持CORS）)，CORS也已经成为主流的跨域解决方案。

##### **1、 前端设置：**

1.）原生ajax

```
// 前端设置是否带cookie
xhr.withCredentials = true;
```

示例代码：

```
var xhr = new XMLHttpRequest(); // IE8/9需用window.XDomainRequest兼容

// 前端设置是否带cookie
xhr.withCredentials = true;

xhr.open('post', 'http://www.domain2.com:8080/login', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('user=admin');

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
};
```

2.）jQuery ajax

```
$.ajax({
    ...
   xhrFields: {
       withCredentials: true    // 前端设置是否带cookie
   },
   crossDomain: true,   // 会让请求头中包含跨域的额外信息，但不会含cookie
    ...
});
```

3.）vue框架
在vue-resource封装的ajax组件中加入以下代码：

```
Vue.http.options.credentials = true
```

##### **2、 服务端设置：**

若后端设置成功，前端浏览器控制台则不会出现跨域报错信息，反之，说明没设成功。

1.）Java后台：

```
/*
 * 导入包：import javax.servlet.http.HttpServletResponse;
 * 接口参数中定义：HttpServletResponse response
 */

// 允许跨域访问的域名：若有端口需写全（协议+域名+端口），若没有端口末尾不用加'/'
response.setHeader("Access-Control-Allow-Origin", "http://www.domain1.com"); 

// 允许前端带认证cookie：启用此项后，上面的域名不能为'*'，必须指定具体的域名，否则浏览器会提示
response.setHeader("Access-Control-Allow-Credentials", "true"); 
```

2.）Nodejs后台示例：

```
var http = require('http');
var server = http.createServer();
var qs = require('querystring');

server.on('request', function(req, res) {
    var postData = '';

    // 数据块接收中
    req.addListener('data', function(chunk) {
        postData += chunk;
    });

    // 数据接收完毕
    req.addListener('end', function() {
        postData = qs.parse(postData);

        // 跨域后台设置
        res.writeHead(200, {
            'Access-Control-Allow-Credentials': 'true',     // 后端允许发送Cookie
            'Access-Control-Allow-Origin': 'http://www.domain1.com',    // 允许访问的域（协议+域名+端口）
            /* 
             * 此处设置的cookie还是domain2的而非domain1，因为后端也不能跨域写cookie(nginx反向代理可以实现)，
             * 但只要domain2中写入一次cookie认证，后面的跨域接口都能从domain2中获取cookie，从而实现所有的接口都能跨域访问
             */
            'Set-Cookie': 'l=a123456;Path=/;Domain=www.domain2.com;HttpOnly'  // HttpOnly的作用是让js无法读取cookie
        });

        res.write(JSON.stringify(postData));
        res.end();
    });
});

server.listen('8080');
console.log('Server is running at port 8080...');
```

## 浏览器缓存

http://www.cnblogs.com/lyzg/p/5125934.html

##　性能优化

https://juejin.im/post/5a99f80cf265da238c3a1e16

