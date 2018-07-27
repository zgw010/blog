# 内置类型

基本数据类型:number,string,null,undefined,symbol,boolean;

对象:object.

js的number是IEEE 754标准下64-bits的双精度数值.`IEEE 754标准`是目前使用最广泛的浮点数运算标准。 

维基百科对IEEE 754有下面的定义:

> 这个标准定义了表示浮点数的格式（包括负零-0）与反常值（denormal number）），一些特殊数值（无穷（Inf）与非数值（NaN）），以及这些数值的“浮点数运算符”；它也指明了四种数值舍入规则和五种例外状况（包括例外发生的时机与处理方式）。 

什么是浮点数呢?

> 我们知道，对于计算机而言，数字没有小数和整数的差别，也就是计算机中没有`小数点`的存在。通过前文的讨论，我们已经找到了很完美的整数存储计算的方案，但是当涉及到小数，我们很容易发现，现有的方案无法解决我们的需求。然后，计算机科学家们便尝试了多种方案，主要便是`定点数`和`浮点数`两种。
>
> 所谓定点数，是指小数点位置固定在数串中间的某个特定位置，点两侧分别为数字的整数和小数部分。比如用8-bits字长的数串，小数点固定在正中间位置，那么`11001001`和`00110101`分别表示1100.1001和11.0101两个数字。这种方案简单直观易理解，但是存在严重的空间浪费，以及容易溢出的问题。
>
> 所谓浮点数，是指小数点的位置是不固定的，通过科学计数法(这个应该不需要解释吧)的方式控制小数点的位置，表示不同的数字。

js中可以表示的数值有`2^64 − 2^53 + 3 =18437736874454810627`个

为什么是这个数字？因为，我们说JavaScript中的数字是64-bits的双精度，所以首先有`2^64`中可能的组合，然后，按照前述的`IEEE 754标准`的标准中的`特殊值`中的部分，`NaN`和`±∞`占用了`2^53`个数值，但是表示了三个直观的量，所以，加减一下，自然就是`18437736874454810627 (that is, 2^64 − 2^53 + 3) values`。 

为什么`0.1+0.2===0.3`返回`false`呢?

因为浮点数的个数是无限的,所以js不能表达所有的浮点数,而只能是一个近似值.

js中的相等比较:https://segmentfault.com/a/1190000000650129

这个链接里面的`ToPrimitive()`大致就是下面的类型转换说到的先调用 `valueOf` 然后调用 `toString`.

# typeof

`typeof`对于基本类型,除了null都可以显示正确的类型

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof b // b 没有声明，但是还会显示 undefined
```

对于 `null` 来说，虽然它是基本类型，但是会显示 `object`，这是一个 Bug

```js
typeof null // 'object'
```

> PS：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，`000` 开头代表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object`。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。 

`typeof`对于对象,除了函数都会显示`object`

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

我们可以通过`Object.prototype.toString.call(xx)`来获取一个变量的正确类型.然后我们会获得一个类似`[Object Type]` 的字符串 .

```js
//补充
let a
// 我们也可以这样判断 undefined
a === undefined
// 但是 undefined 保留字，能够在低版本浏览器被赋值
let undefined = 1
// 这样判断就会出错
// 所以可以用下面的方式来判断，并且代码量更少
// 因为 void 后面随便跟上一个组成表达式
// 返回就是 undefined
a === void 0
```

# 类型转化

## 转Boolean

在条件判断时，除了 `undefined`， `null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`，包括所有对象。

### 对象转基本类型

对象在转换基本类型时，首先会调用 `valueOf` 然后调用 `toString`。并且这两个方法你是可以重写的。

| **对象** | **返回值**                                               |
| -------- | -------------------------------------------------------- |
| Array    | 返回数组对象本身。                                       |
| Boolean  | 布尔值。                                                 |
| Date     | 存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC。 |
| Function | 函数本身。                                               |
| Number   | 数字值。                                                 |
| Object   | 对象本身。这是默认情况。                                 |
| String   | 字符串值。                                               |
|          | Math 和 Error 对象没有 valueOf 方法。                    |

```js
let a = {
    valueOf() {
    	return 0
    }
}
```

### 四则运算符

只有当加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。其他运算只要其中一方是数字，那么另一方就转为数字。并且加法运算会触发三种类型转换：将值转换为原始值，转换为数字，转换为字符串。

```js
1 + '1' // '11'
2 * '2' // 4
[1, 2] + [2, 1] // '1,22,1'
// [1, 2].toString() -> '1,2'
// [2, 1].toString() -> '2,1'
// '1,2' + '2,1' = '1,22,1'
```

对于加号需要注意这个表达式 `'a' + + 'b'`

```js
'a' + + 'b' // -> "aNaN"
// 因为 + 'b' -> NaN
// 你也许在一些代码中看到过 + '1' -> 1
```

这里来解析一道题目 `[] == ![] // -> true` ，下面是这个表达式为何为 `true` 的步骤

```js
// [] 转成 true，然后取反变成 false
[] == false
// 根据第 8 条得出
[] == ToNumber(false)
[] == 0
// 根据第 10 条得出
ToPrimitive([]) == 0
// [].toString() -> ''
'' == 0
// 根据第 6 条得出
0 == 0 // -> true
```

## 原型

![prototype](https://camo.githubusercontent.com/71cab2efcf6fb8401a2f0ef49443dd94bffc1373/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f332f31332f313632316538613962636230383732643f773d34383826683d35393026663d706e6726733d313531373232)

每个函数都有 `prototype` 属性，除了 `Function.prototype.bind()`，该属性指向原型。

每个对象都有 `__proto__` 属性，指向了创建该对象的构造函数的原型。其实这个属性指向了 `[[prototype]]`，但是 `[[prototype]]` 是内部属性，我们并不能访问到，所以使用 `_proto_` 来访问。

对象可以通过 `__proto__` 来寻找不属于该对象的属性，`__proto__` 将对象连接起来组成了原型链。

如果你想更进一步的了解原型，可以仔细阅读 [深度解析原型中的各个难点](https://github.com/KieSun/Blog/issues/2)。

## new

1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

下面是MDN中对`new`的描述

> 当代码 `new `*Foo*`(...)` 执行时，会发生以下事情：
>
> 1. 一个继承自 *Foo*`.prototype` 的新对象被创建。
> 2. 使用指定的参数调用构造函数 `Foo` ，并将 `this` 绑定到新创建的对象。`new Foo` 等同于 `new `*Foo*`()`，也就是没有指定参数列表，*Foo* 不带任何参数调用的情况。
> 3. 由构造函数返回的对象就是 `new` 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

在调用 `new` 的过程中会发生以上四件事情，我们也可以试着来自己实现一个 `new`

```js
function objectFactory() {
	// 一个继承自 Foo.prototype 的新对象被创建。
    var obj = new Object(),//从Object.prototype上克隆一个对象
    Constructor = [].shift.call(arguments);//取得外部传入的构造器
    obj.__proto__ = Constructor.prototype;
    
    // 上面的最后一行行等价于下面的三行,之所以会有下面的替代版是为了兼容性
    // var F=function(){};
    // F.prototype= Constructor.prototype;
    // obj=new F(); //指向正确的原型

    var ret = Constructor.apply(obj, arguments);//借用外部传入的构造器给obj设置属性

    return typeof ret === 'object' ? ret : obj;//确保构造器总是返回一个对象

};
```

对于实例对象来说，都是通过 `new` 产生的，无论是 `function Foo()` 还是 `let a = { b : 1 }` 。

对于创建一个对象来说，更推荐使用字面量的方式创建对象（无论性能上还是可读性）。因为你使用 `new Object()` 的方式创建对象需要通过作用域链一层层找到 `Object`，但是你使用字面量的方式就没这个问题。

```js
function Foo() {}
// function 就是个语法糖
// 内部等同于 new Function()
let a = { b: 1 }
// 这个字面量内部也是使用了 new Object()
```

对于 `new` 来说，还需要注意下运算符优先级。

```js
function Foo() {
    return this;
}
Foo.getName = function () {
    console.log('1');
};
Foo.prototype.getName = function () {
    console.log('2');
};

new Foo.getName();   // -> 1
new Foo().getName(); // -> 2       
```

![img](InterviewMap之js.assets/162a9c56c838aa88)

从上图可以看出，`new Foo()` 的优先级大于 `new Foo` ，所以对于上述代码来说可以这样划分执行顺序

```
new (Foo.getName());   
(new Foo()).getName();
```

对于第一个函数来说，先执行了 `Foo.getName()` ，所以结果为 1；对于后者来说，先执行 `new Foo()` 产生了一个实例，然后通过原型链找到了 `Foo` 上的 `getName` 函数，所以结果为 2。

# instanceof

`instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`。

`instanceof`的语法:

```
object instanceof constructor
```

参数:

- `object`

  要检测的对象.

- `constructor`

  某个构造函数

`instanceof `运算符用来检测 `constructor.prototype `是否存在于参数 `object` 的原型链上。 

我们也可以试着实现一下 `instanceof`

```js
function instanceof(left, right) {
    // 获得类型的原型
    let prototype = right.prototype
    // 获得对象的原型
    left = left.__proto__
    // 判断对象的类型是否等于类型的原型
    while (true) {
    	if (left === null)
    		return false
    	if (prototype === left)
    		return true
    	left = left.__proto__
    }
}
```
## this

`this` 是很多人会混淆的概念，但是其实他一点都不难，你只需要记住几个规则就可以了。

```js
function foo() {
	console.log(this.a)
}
var a = 2
foo()

var obj = {
	a: 2,
	foo: foo
}
obj.foo()

// 以上两者情况 `this` 只依赖于调用函数前的对象，优先级是第二个情况大于第一个情况

// 以下情况是优先级最高的，`this` 只会绑定在 `c` 上，不会被任何方式修改 `this` 指向
var c = new foo()
c.a = 3
console.log(c.a)

// 还有种就是利用 call，apply，bind 改变 this，这个优先级仅次于 new
```

以上几种情况明白了，很多代码中的 `this` 应该就没什么问题了，下面让我们看看箭头函数中的 `this`

```js
function a() {
    return () => {
        return () => {
        	console.log(this)
        }
    }
}
console.log(a()()())
```

箭头函数其实是没有 `this` 的，这个函数中的 `this` 只取决于他外面的第一个不是箭头函数的函数的 `this`。在这个例子中，因为调用 `a` 符合前面代码中的第一个情况，所以 `this` 是 `window`。并且 `this` 一旦绑定了上下文，就不会被任何代码改变。

在javascript中，函数的调用一共有5种方式：

- Function Invocation Pattern

  诸如`foo()`的调用形式被称为Function Invocation Pattern，是函数最直接的使用形式，注意这里的foo是作为单独的变量出现，而不是属性。

  在这种模式下，foo函数体中的this永远为**Global对象**，在浏览器中就是window对象。

- Method Invocation Pattern

  诸如`foo.bar()`的调用形式被称为Method Invocation Pattern，注意其特点是被调用的函数作为一个对象的属性出现，必然会有“.”或者“[]”这样的关键符号。

  在这种模式下，bar函数体中的this永远为**“.”或“[”前的那个对象**，如上例中就一定是foo对象。

- Constructor Pattern

  `new foo()`这种形式的调用被称为Constructor Pattern，其关键字`new`就很能说明问题，非常容易识别。

  在这种模式下，foo函数内部的this永远是**new foo()返回的对象**。

- Apply Pattern

  `foo.call(thisObject)`和`foo.apply(thisObject)`的形式被称为Apply Pattern，使用了内置的`call`和`apply`函数。

  在这种模式下，**call和apply的第一个参数**就是foo函数体内的this，如果thisObject是`null`或`undefined`，那么会变成Global对象。

- 箭头函数

# 执行上下文

https://github.com/mqyqingfeng/Blog/issues/4

https://github.com/mqyqingfeng/Blog/issues/6

https://github.com/mqyqingfeng/Blog/issues/8

当执行 JS 代码时，会产生三种执行上下文

- 全局执行上下文
- 函数执行上下文
- eval 执行上下文

每个执行上下文中都有三个重要的属性

- 变量对象（VO），包含变量、函数声明和函数的形参，该属性只能在全局上下文中访问
- 作用域链（JS 采用词法作用域，也就是说变量的作用域是在定义时就决定了）
- this

```js
var a = 10
function foo(i) {
  var b = 20
}
foo()
```

对于上述代码，执行栈中有两个上下文：全局上下文和函数 `foo` 上下文。

```js
stack = [
    globalContext,
    fooContext
]
```

对于全局上下文来说，VO 大概是这样的

```js
globalContext.VO === globe
globalContext.VO = {
    a: undefined,
	foo: <Function>,
}
```

对于函数 `foo` 来说，VO 不能访问，只能访问到活动对象（AO）

```js
fooContext.VO === foo.AO
fooContext.AO {
    i: undefined,
	b: undefined,
    arguments: <>
}
// arguments 是函数独有的对象(箭头函数没有)
// 该对象是一个伪数组，有 `length` 属性且可以通过下标访问元素
// 该对象中的 `callee` 属性代表函数本身
// `caller` 属性代表函数的调用者
```

对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过 `[[Scope]]` 属性查找上级变量

```js
fooContext.[[Scope]] = [
    globalContext.VO
]
fooContext.Scope = fooContext.[[Scope]] + fooContext.VO
fooContext.Scope = [
    fooContext.VO,
    globalContext.VO
]
```

接下来让我们看一个老生常谈的例子，`var`

```js
b() // call b
console.log(a) // undefined

var a = 'Hello world'

function b() {
	console.log('call b')
}
```

想必以上的输出大家肯定都已经明白了，这是因为函数和变量提升的原因。通常提升的解释是说将声明的代码移动到了顶部，这其实没有什么错误，便于大家理解。但是更准确的解释应该是：在生成执行上下文时，会有两个阶段。第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

```js
b() // call b second

function b() {
	console.log('call b fist')
}
function b() {
	console.log('call b second')
}
var b = 'Hello world'
```

`var` 会产生很多错误，所以在 ES6中引入了 `let`。`let` 不能在声明前使用，但是这并不是常说的 `let` 不会提升，`let` 提升了声明但没有赋值，因为临时死区导致了并不能在声明前使用。

对于非匿名的立即执行函数需要注意以下一点

```js
var foo = 1
(function foo() {
    foo = 10
    console.log(foo)
}()) // -> ƒ foo() { foo = 10 ; console.log(foo) }
```

因为当 JS 解释器在遇到非匿名的立即执行函数时，会创建一个辅助的特定对象，然后将函数名称作为这个对象的属性，因此函数内部才可以访问到 `foo`，但是这又个值是只读的，所以对它的赋值并不生效，所以打印的结果还是这个函数，并且外部的值也没有发生更改。

> ```js
> specialObject = {};
>  
> Scope = specialObject + Scope;
>  
> foo = new FunctionExpression;
> foo.[[Scope]] = Scope;
> specialObject.foo = foo; // {DontDelete}, {ReadOnly}
>  
> delete Scope[0]; // remove specialObject from the front of scope chain
> ```

## 闭包

闭包的定义很简单：函数 A 返回了一个函数 B，并且函数 B 中使用了函数 A 的变量，函数 B 就被称为闭包。

```js
function A() {
  let a = 1
  function B() {
      console.log(a)
  }
  return B
}
```

你是否会疑惑，为什么函数 A 已经弹出调用栈了，为什么函数 B 还能引用到函数 A 中的变量。因为函数 A 中的变量这时候是存储在堆上的。现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

经典面试题，循环中使用闭包解决 `var` 定义函数的问题

```js
for ( var i=1; i<=5; i++) {
	setTimeout( function timer() {
		console.log( i );
	}, i*1000 );
}˝
```

首先因为 `setTimeout` 是个异步函数，所有会先把循环全部执行完毕，这时候 `i` 就是 6 了，所以会输出一堆 6。

解决办法两种，第一种使用闭包

```js
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

第二种就是使用 `setTimeout` 的第三个参数

```js
for ( var i=1; i<=5; i++) {
	setTimeout( function timer(j) {
		console.log( j );
	}, i*1000, i);
}
```

因为对于 `let` 来说

第三种就是使用 `let` 定义 `i` 了

```js
for ( let i=1; i<=5; i++) {
	setTimeout( function timer() {
		console.log( i );
	}, i*1000 );
}
```

因为对于 `let` 来说，他会创建一个块级作用域，相当于

```js
{ // 形成块级作用域
  let i = 0
  {
    let ii = i
    setTimeout( function timer() {
        console.log( i );
    }, i*1000 );
  }
  i++
  {
    let ii = i
  }
  i++
  {
    let ii = i
  }
  ...
}
```

## 深浅拷贝

```
let a = {
    age: 1
}
let b = a
a.age = 2
console.log(b.age) // 2
```

从上述例子中我们可以发现，如果给一个变量赋值一个对象，那么两者的值会是同一个引用，其中一方改变，另一方也会相应改变。

通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个问题。

## 浅拷贝

首先可以通过 `Object.assign` 来解决这个问题。

```
let a = {
    age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

当然我们也可以通过展开运算符（…）来解决

```
let a = {
    age: 1
}
let b = {...a}
a.age = 2
console.log(b.age) // 1
```

通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就需要使用到深拷贝了

```
let a = {
    age: 1,
    jobs: {
        first: 'FE'
    }
}
let b = {...a}
a.jobs.first = 'native'
console.log(b.jobs.first) // native
```

浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们需要引入深拷贝。

## 深拷贝

这个问题通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决。

```
let a = {
    age: 1,
    jobs: {
        first: 'FE'
    }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // FE
```

但是该方法也是有局限性的：

- 会忽略 `undefined`
- 不能序列化函数
- 不能解决循环引用的对象

```
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.d = obj.b
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)
```

如果你有这么一个循环引用对象，你会发现你不能通过该方法深拷贝

![img](InterviewMap之js.assets/1626b1ec2d3f9e41)

在遇到函数或者 `undefined` 的时候，该对象也不能正常的序列化

```
let a = {
    age: undefined,
    jobs: function() {},
    name: 'yck'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "yck"}
```

你会发现在上述情况中，该方法会忽略掉函数和 `undefined` 。

但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的。当然如果你的数据中含有以上三种情况下，可以使用 [loadash 的深拷贝函数](https://lodash.com/docs##cloneDeep)。

如果你所需拷贝的对象含有内置类型并且不包含函数，可以使用 `MessageChannel`

```
function structuralClone(obj) {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

var obj = {a: 1, b: {
    c: b
}}
// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
const clone = await structuralClone(obj);
```

#  模块化

在有 Babel 的情况下，我们可以直接使用 ES6 的模块化

```js
// file a.js
export function a() {}
export function b() {}
// file b.js
export default function() {}

import {a, b} from './a.js'
import XXX from './b.js'
```

## CommonJS

`CommonJs` 是 Node 独有的规范，浏览器中使用就需要用到 `Browserify` 解析了。

```js
// a.js
module.exports = {
    a: 1
}
// or
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```

在上述代码中，`module.exports` 和 `exports` 很容易混淆，让我们来看看大致内部实现

```js
var module = require('./a.js')
module.a
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
    a: 1
}
// 基本实现
var module = {
  exports: {} // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports
var load = function (module) {
    // 导出的东西
    var a = 1
    module.exports = a
    return module.exports
};
```

再来说说 `module.exports` 和 `exports`，用法其实是相似的，但是不能对 `exports` 直接赋值，不会有任何效果。

对于 `CommonJS` 和 ES6 中的模块化的两者区别是：

- 前者支持动态导入，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案
- 前者是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用导入会对渲染有很大影响
- 前者在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
- 后者会编译成 `require/exports` 来执行的

## AMD

AMD 是由 `RequireJS` 提出的.这个方案主要解决前端动态加载依赖，相比 commonJs，体积更小，按需加载。

```js
// AMD
define(['./a', './b'], function(a, b) {
    a.do()
    b.do()
})
define(function(require, exports, module) {   
    var a = require('./a')  
    a.doSomething()   
    var b = require('./b')
    b.doSomething()
})
```
# 防抖

你是否在日常开发中遇到一个问题，在滚动事件中需要做个复杂计算或者实现一个按钮的防二次点击操作。

这些需求都可以通过函数防抖动来实现。尤其是第一个需求，如果在频繁的事件回调中做复杂计算，很有可能导致页面卡顿，不如将多次计算合并为一次计算，只在一个精确点做操作。因为防抖动的轮子很多，这里也不重新自己造个轮子了，直接使用 underscore 的源码来解释防抖动。

```js
/**
 * underscore 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
_.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      // 现在和上一次时间戳比较
      var last = _.now() - timestamp;
      // 如果当前间隔时间少于设定时间且大于0就重新设置定时器
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        // 否则的话就是时间到了执行回调函数
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      // 获得时间戳
      timestamp = _.now();
      // 如果定时器不存在且立即执行函数
      var callNow = immediate && !timeout;
      // 如果定时器不存在就创建一个
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        // 如果需要立即执行函数的话 通过 apply 执行
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };
```

整体函数实现的不难，总结一下。

- 对于按钮防点击来说的实现：一旦我开始一个定时器，只要我定时器还在，不管你怎么点击都不会执行回调函数。一旦定时器结束并设置为 `null`，就可以再次点击了。
- 对于延时执行函数来说的实现：每次调用防抖动函数都会判断本次调用和之前的时间间隔，如果小于需要的时间间隔，就会重新创建一个定时器，并且定时器的延时为设定时间减去之前的时间间隔。一旦时间到了，就会执行相应的回调函数。

# 节流

防抖动和节流本质是不一样的。防抖动是将多次执行变为最后一次执行，节流是将多次执行变成每隔一段时间执行。

```js
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数   
 */
_.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    // 之前的时间戳
    var previous = 0;
    // 如果 options 没传则设为空对象
    if (!options) options = {};
    // 定时器回调函数
    var later = function() {
      // 如果设置了 leading，就将 previous 设为 0
      // 用于下面函数的第一个 if 判断
      previous = options.leading === false ? 0 : _.now();
      // 置空一是为了防止内存泄漏，二是为了下面的定时器判断
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      // 获得当前时间戳
      var now = _.now();
      // 首次进入前者肯定为 true
	  // 如果需要第一次不执行函数
	  // 就将上次时间戳设为当前的
      // 这样在接下来计算 remaining 的值时会大于0
      if (!previous && options.leading === false) previous = now;
      // 计算剩余时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      // 如果当前调用已经大于上次调用时间 + wait
      // 或者用户手动调了时间
 	  // 如果设置了 trailing，只会进入这个条件
	  // 如果没有设置 leading，那么第一次会进入这个条件
	  // 还有一点，你可能会觉得开启了定时器那么应该不会进入这个 if 条件了
	  // 其实还是会进入的，因为定时器的延时
	  // 并不是准确的时间，很可能你设置了2秒
	  // 但是他需要2.2秒才触发，这时候就会进入这个条件
      if (remaining <= 0 || remaining > wait) {
        // 如果存在定时器就清理掉否则会调用二次回调
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        // 判断是否设置了定时器和 trailing
	    // 没有的话就开启一个定时器
        // 并且不能不能同时设置 leading 和 trailing
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };
```

# 继承

## 1.原型链继承

```js
function Parent () {
    this.name = 'kevin';
}

Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child () {

}

Child.prototype = new Parent();

var child1 = new Child();

console.log(child1.getName()) // kevin
```

问题：

1.引用类型的属性被所有实例共享，举个例子：

```js
function Parent () {
    this.names = ['kevin', 'daisy'];
}

function Child () {

}

Child.prototype = new Parent();

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy", "yayu"]
```

2.在创建 Child 的实例时，不能向Parent传参

## 2.借用构造函数(经典继承)

```js
function Parent () {
    this.names = ['kevin', 'daisy'];
}

function Child () {
    Parent.call(this);
}

var child1 = new Child();

child1.names.push('yayu');

console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();

console.log(child2.names); // ["kevin", "daisy"]
```

优点：

1.避免了引用类型的属性被所有实例共享

2.可以在 Child 中向 Parent 传参

举个例子：

```js
function Parent (name) {
    this.name = name;
}

function Child (name) {
    Parent.call(this, name);
}

var child1 = new Child('kevin');

console.log(child1.name); // kevin

var child2 = new Child('daisy');

console.log(child2.name); // daisy
```

缺点：

方法都在构造函数中定义，每次创建实例都会创建一遍方法。

## 3.组合继承

原型链继承和经典继承双剑合璧。

```js
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {

    Parent.call(this, name);
    
    this.age = age;

}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

var child1 = new Child('kevin', '18');

child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。

## 4.原型式继承

```js
function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
```

就是 ES5 Object.create 的模拟实现，将传入的对象作为创建的对象的原型。

缺点：

包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

```js
var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.firends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```

注意：修改`person1.name`的值，`person2.name`的值并未发生改变，并不是因为`person1`和`person2`有独立的 name 值，而是因为`person1.name = 'person1'`，给`person1`添加了 name 值，并非修改了原型上的 name 值。

## 5. 寄生式继承

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```
function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法。

## 6. 寄生组合式继承

为了方便大家阅读，在这里重复一下组合继承的代码：

```
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}

Child.prototype = new Parent();

var child1 = new Child('kevin', '18');

console.log(child1)
```

组合继承最大的缺点是会调用两次父构造函数。

一次是设置子类型实例的原型的时候：

```
Child.prototype = new Parent();
```

一次在创建子类型实例的时候：

```
var child1 = new Child('kevin', '18');
```

回想下 new 的模拟实现，其实在这句中，我们会执行：

```
Parent.call(this, name);
```

在这里，我们又会调用了一次 Parent 构造函数。

所以，在这个例子中，如果我们打印 child1 对象，我们会发现 Child.prototype 和 child1 都有一个属性为`colors`，属性值为`['red', 'blue', 'green']`。

那么我们该如何精益求精，避免这一次重复调用呢？

如果我们不使用 Child.prototype = new Parent() ，而是间接的让 Child.prototype 访问到 Parent.prototype 呢？

看看如何实现：

```
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}

// 关键的三步
var F = function () {};

F.prototype = Parent.prototype;

Child.prototype = new F();


var child1 = new Child('kevin', '18');

console.log(child1);
```

最后我们封装一下这个继承方法：

```
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function prototype(child, parent) {
    var prototype = object(parent.prototype);
    prototype.constructor = child;
    child.prototype = prototype;
}

// 当我们使用的时候：
prototype(Child, Parent);
```

引用《JavaScript高级程序设计》中对寄生组合式继承的夸赞就是：

这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。