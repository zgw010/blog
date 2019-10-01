## bind
>bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

> #### 语法
>`fun.bind(thisArg[, arg1[, arg2[, ...]]])`

>#### 参数
>`thisArg`
当绑定函数被调用时，该参数会作为原函数运行时的 this 指向。当使用new 操作符调用绑定函数时，该参数无效。
`arg1, arg2, ...`
当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。
>#### 返回值
>返回由指定的this值和初始化参数改造的原函数拷贝

>#### 描述
>_bind()_ 函数会创建一个新函数（称为绑定函数），新函数与被调函数（绑定函数的目标函数）具有相同的函数体。当新函数被调用时 _this_ 值绑定到 _bind()_ 的第一个参数，该参数不能被重写。绑定函数被调用时，_bind()_ 也接受预设的参数提供给原函数。一个绑定函数也能使用`new`操作符创建对象：这种行为就像把原函数当成构造器。提供的 _this_ 值被忽略，同时调用时的参数被提供给模拟函数。

#### 返回函数的模拟实现

```js
Function.prototype.bind2 = function (context) {

  if (typeof this !== "function") {
    throw new Error("error");
  }

  const arg1 = [...arguments].slice(1);
  const _this = this;
  const bindHelper = function () {
    const arg2 = [...arguments];
    return _this.apply(this instanceof bindHelper ? this : context, [...arg1, ...arg2]);
  }
  bindHelper.prototype = Object.create(this.prototype)
  return bindHelper;
}
```

> 来源: https://github.com/mqyqingfeng/Blog/issues/12