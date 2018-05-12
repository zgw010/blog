>本文是读 [冴羽](https://github.com/mqyqingfeng/Blog/issues/11) blog 的读书笔记,记录自己对于这篇博客的所有理解,把一些看不懂的地方加上了注释
## call和apply是为了动态改变this而出现的

### call()
>call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。
call使用的例子
```
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```
* call 改变了 this 的指向，指向到 foo
* bar 函数执行了
#### 模拟实现第一步
首先想到的就是把bar添加到foo里面,像下面这样.
```
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```
这样this就会自然的指向foo了,但是这个时候我们就给foo多增加了一个属性,我们可以通过 `delete`来删除它.
整个过程如下:
1. 将函数设为对象的属性
1. 执行该函数
1. 删除该函数
```
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```
于是我们有了第一版本的`call`
```
// 第一版
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this;
    context.fn();
    delete context.fn;
}
```
但是这个过程中有一个隐含的问题.存在一个可能,foo函数中本来就含有一个fn属性,这样会造成命名冲突发生,我们可以使用ES6的`Symbol`.
下面是`Symbol`的介绍:
>ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因。
ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。
Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

使用了 `Symbol` 之后就可以解决上述问题了,但是这里只说call的简单实现,假设没有冲突,所以我们就不适用`Symbol`了.
#### 模拟实现第二步
call是可以穿参数进去的.例如:
```
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call(foo, 'kevin', 18);
// kevin
// 18
// 1
```
之前的代码并没有实现这个功能.
我们可以从 arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。
```
// 以上个例子为例，此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'kevin',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}
// 执行后 args为 ["arguments[1]", "arguments[2]"]
//如果这里为args.push('arguments[i]');
//结果会是args为 ["arguments[i]", "arguments[i]"]
//如果这里为args.push(arguments[i]);
//结果会是args为 ['kwvin', 18];
//但是这样的话在
    function bar(name, age) {
        console.log(name)
        console.log(age)
        console.log(this.value);
    }
//里面会获取不到name和age,会显示undecided,因为这里把['kwvin', 18]传入了bar,
//在bar里面根本找不到name和age,使用ES6会很好的解决这个问题,这里不使用ES6的方法,使用ES3的方法eval
```
我们已经把参数都放到 args 数组里面了,接下来的事情是把这个数组放到要执行的函数的参数里面去。
因为此时的 args 为 ["arguments[1]", "arguments[2]", "arguments[3]"]所以我们可以使用 eval 
**eval函数接收参数是个字符串**
定义和用法

>eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。

语法：
`eval(string)`

>string必需。要计算的字符串，其中含有要计算的 JavaScript 表达式或要执行的语句。该方法只接受原始字符串作为参数，如果 string 参数不是原始字符串，那么该方法将不作任何改变地返回。因此请不要为 eval() 函数传递 String 对象来作为参数。

简单来说吧，就是用JavaScript的解析引擎来解析这一堆字符串里面的内容，这么说吧，可以这么理解，把`eval`看成是`<script>`标签。
```
// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```
#### 模拟实现第三部
还有两个小点要注意：

1. __this 参数可以传 null，当为 null 的时候，视为指向 window__
2. __函数是可以有返回值的！__

下面是第三版代码:
```
// 第三版
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

#### apply的模拟实现
因为apply和call没有很大的区别,所以后面的东西就不解释了,这段代码来自知乎 @郑航
```
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```
#### call的ES6实现

```
Function.prototype.call2 = function (context, ...args) {
    context = context || window
    context.__fn__ = this
    let result = context.__fn__(...args)
    delete context.__fn__
    return result
}
```