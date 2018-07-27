> Promises/A+ 规范 https://promisesaplus.com/

<del>`new Promise(){function(){resolve,reject}}`中进行异步操作,然后then使用resolve传入的参数来进行下一步的操作.

```js
.then(function (fulfilled) {
	console.log(fulfilled);
})
```

`fulfilled` 是什么？`fulfilled` 就是传入 Promise 的 `resolve(your_success_value)` </del>

xxx.then(a => a) 的效果实际上是 return new Promise(resolve => resolve(a)) 





Promise 的整体流程:

使用:

```js
var a=new Promise(function(resolve,reject){
  ...
  resolve(...);
  ...
  reject(...);
})
a.then(function(){});
```

首先在 new 一个 Promise 的时候,执行以下步骤:(来自MDN)

> 1. 一个继承自 *Foo*`.prototype` 的新对象被创建。
> 2. 使用指定的参数调用构造函数 `Foo` ，并将 `this` 绑定到新创建的对象。`new *Foo*` 等同于 `new `*Foo*`()`，也就是没有指定参数列表，*Foo* 不带任何参数调用的情况。
> 3. 由构造函数返回的对象就是 `new` 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

在这个过程中

```js
try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
```

会被执行,fn函数被执行,在fn函数中`_this.resolve和_this.reject`也被执行,但是是异步的,所以并不会马上执行,这个时候会先运行后面的`.then()`函数.

```js
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  // 用于保存 then 中的回调，只有当 promise 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED;
        _this.value = value;
        _this
          .resolvedCallbacks
          .forEach(cb => cb());
      }
    })
  };

  _this.reject = function (reason) {
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED;
        _this.value = reason;
        _this
          .rejectedCallbacks
          .forEach(cb => cb());
      }
    })
  }
  // 用于解决以下问题 new Promise(() => throw Error('error))
  try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2;
  // 规范 2.2.onResolved 和 onRejected 都为可选参数 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function'
    ? onResolved
    : v => v;
  onRejected = typeof onRejected === 'function'
    ? onRejected
    : r => {
      throw r
    };

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行 所以用了 setTimeout 包裹下
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self
        .resolvedCallbacks
        .push(function () {
          // 考虑到可能会有报错，所以使用 try/catch 包裹
          try {
            var x = onResolved(self.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (r) {
            reject(r);
          }
        });

      self
        .rejectedCallbacks
        .push(function () {
          try {
            var x = onRejected(self.value);
            resolutionProcedure(promise2, x, resolve, reject);
          } catch (r) {
            reject(r);
          }
        });
    }));
  }
};
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  // 规范 2.3.2 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x
        .then(function (value) {
          // 再次调用该函数是为了确认 x resolve 的 参数是什么类型，如果是基本类型就再次 resolve 把值传给下个 then
          resolutionProcedure(promise2, value, resolve, reject);
        }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  // 规范 2.3.3.3.3 reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false;
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === "function") {
        // 规范 2.3.3.3
        then.call(x, y => {
          if (called) 
            return;
          called = true;
          // 规范 2.3.3.3.1
          resolutionProcedure(promise2, y, resolve, reject);
        }, e => {
          if (called) 
            return;
          called = true;
          reject(e);
        });
      } else {
        // 规范 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) 
        return;
      called = true;
      reject(e);
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x);
  }
}
```



> - 绝对不能对异步回调函数（即使在数据已经就绪）进行同步调用。
> - 如果对异步回调函数进行同步调用的话，处理顺序可能会与预期不符，可能带来意料之外的后果。
> - 对异步回调函数进行同步调用，还可能导致栈溢出或异常处理错乱等问题。
> - 如果想在将来某时刻调用异步回调函数的话，可以使用 `setTimeout` 等异步API。
>
> ​                                                                  Effective JavaScript— David Herman



> 上面的都是随笔 ,乱记的.下面的读书笔记会有条理一点.

Promise的内部属性[[PromiseState]]被用来表示Promise的3种状态.这个属性不暴露在Promise对象上,所以不能以编程的方式检测Promise的状态,只有当Promise的状态改变时,通过then()方法来采取特性的行动.

所有Promise都有then()方法,它接受两个参数:第一个适当Promise的状态变为fulfilled时要调用的函数,与异步操作相关的附加数据都会传递给这个完成函数(fulfillment function);第二个是当Promise的状态变更为rejected时要调用的函数,其与完成时调用的函数类似,所有与失败状态相关的附加数据都会传递给这个拒绝函数(rejected function).