# 基本概念

> **Promise** 对象用于表示一个异步操作的最终状态（完成或失败），以及其返回的值。

`Promise` 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象

一个 `Promise`有以下几种状态:

- *pending*: 初始状态，既不是成功，也不是失败状态。
- *fulfilled*: 意味着操作成功完成。
- *rejected*: 意味着操作失败。

pending 状态的 Promise 对象可能触发fulfilled 状态并传递一个值给相应的状态处理方法，也可能触发失败状态（rejected）并传递失败信息。当其中任一种情况出现时，Promise 对象的 `then` 方法绑定的处理方法（handlers ）就会被调用（then方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。当Promise状态为*fulfilled*时，调用 then 的 onfulfilled 方法，当Promise状态为*rejected*时，调用 then 的 onrejected 方法， 所以在异步操作的完成和绑定处理方法之间不存在竞争）。

因为 `Promise.prototype.then` 和  `Promise.prototype.catch` 方法返回promise 对象， 所以它们可以被链式调用。

![img](https://mdn.mozillademos.org/files/8633/promises.png)

# 总结

## 创建Promise的两种方法

1. `new Promise`

2. `Promise.resolve(value)`

   静态方法[`Promise.resolve(value)`](http://liubin.org/promises-book/#Promise.resolve) 可以认为是 `new Promise()` 方法的快捷方式。

   比如 `Promise.resolve(42);` 可以认为是以下代码的语法糖。

   ```js
   new Promise(function(resolve){
       resolve(42);
   });
   ```

## 每次调用then都会返回一个新创建的promise对象

## Promise.all和Promise.race

[`Promise.all`](http://liubin.org/promises-book/#Promise.all) 接收一个 promise对象的数组作为参数，当这个数组里的所有promise对象全部变为resolve或reject状态的时候，它才会去调用 `.then` 方法。

传递给 [`Promise.all`](http://liubin.org/promises-book/#Promise.all) 的promise并不是一个个的顺序执行的，而是同时开始、并行执行的。

`Promise.all` 在接收到的所有的对象promise都变为 FulFilled 或者 Rejected 状态之后才会继续进行后面的处理， 与之相对的是 `Promise.race` 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理。

## then or catch?

```js
function throwError(value) {
    // 抛出异常
    throw new Error(value);
}
// <1> onRejected不会被调用
function badMain(onRejected) {
    return Promise.resolve(42).then(throwError, onRejected);
}
// <2> 有异常发生时onRejected会被调用
function goodMain(onRejected) {
    return Promise.resolve(42).then(throwError).catch(onRejected);
}
// 运行示例
badMain(function(){
    console.log("BAD");
});
goodMain(function(){
    console.log("GOOD");
});
```

1. 使用`promise.then(onFulfilled, onRejected)` 的话
   - 在 `onFulfilled` 中发生异常的话，在 `onRejected` 中是捕获不到这个异常的。
2. 在 `promise.then(onFulfilled).catch(onRejected)` 的情况下
   - `then` 中产生的异常能在 `.catch` 中捕获
3. [`.then`](http://liubin.org/promises-book/#promise.then) 和 [`.catch`](http://liubin.org/promises-book/#promise.catch) 在本质上是没有区别的
   - 需要分场合使用。

# 实现

