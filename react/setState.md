*基于 React 版本 v 15.6*

```js
ReactComponent.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

--------------------------------------------------------
  
enqueueSetState: function(publicInstance, partialState) {
  if (__DEV__) {
    // This code will only run in development.
    ReactInstrumentation.debugTool.onSetState();
    warning(
      partialState != null,
      'setState(...): You passed an undefined or null state object; ' +
        'instead, use forceUpdate().',
    );
  }

  var internalInstance = getInternalInstanceReadyForUpdate(
    publicInstance,
    'setState',
  );

  if (!internalInstance) {
    return;
  }

  var queue =
    internalInstance._pendingStateQueue ||
    (internalInstance._pendingStateQueue = []);
  queue.push(partialState);

  enqueueUpdate(internalInstance);
  // function enqueueUpdate(internalInstance) {
  //  ReactUpdates.enqueueUpdate(internalInstance);
  // }
}
-------------------------------------------------
function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
  var internalInstance = ReactInstanceMap.get(publicInstance);
  if (!internalInstance) {
    if (__DEV__) {
      var ctor = publicInstance.constructor;
      // Only warn when we have a callerName. Otherwise we should be silent.
      // We're probably calling from enqueueCallback. We don't want to warn
      // there because we already warned for the corresponding lifecycle method.
      warning(
        !callerName,
        '%s(...): Can only update a mounted or mounting component. ' +
          'This usually means you called %s() on an unmounted component. ' +
          'This is a no-op. Please check the code for the %s component.',
        callerName,
        callerName,
        (ctor && (ctor.displayName || ctor.name)) || 'ReactClass',
      );
    }
    return null;
  }

  if (__DEV__) {
    warning(
      ReactCurrentOwner.current == null,
      '%s(...): Cannot update during an existing state transition (such as ' +
        "within `render` or another component's constructor). Render methods " +
        'should be a pure function of props and state; constructor ' +
        'side-effects are an anti-pattern, but can be moved to ' +
        '`componentWillMount`.',
      callerName,
    );
  }

  return internalInstance;
}
---------------------------------------------
function enqueueUpdate(component) {
  ensureInjected();

  // Various parts of our code (such as ReactCompositeComponent's
  // _renderValidatedComponent) assume that calls to render aren't nested;
  // verify that that's the case. (This is called by each top-level update
  // function, like setState, forceUpdate, etc.; creation and
  // destruction of top-level components is guarded in ReactMount.)

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
-----------------------------------------------------------
var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function(callback, a, b, c, d, e) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      return callback(a, b, c, d, e);
    } else {
      return transaction.perform(callback, null, a, b, c, d, e);
    }
  },
};
```



---



> 来源知乎:https://zhuanlan.zhihu.com/p/20328570?refer=purerender

## 引子

```JavaScript
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```

问上述代码中 4 次 console.log 打印出来的 *val* 分别是多少？

不卖关子，先揭晓答案，4 次 log 的值分别是：0、0、2、3。

若结果和你心中的答案不完全相同，那下面的内容你可能会感兴趣。

同样的 setState 调用，为何表现和结果却大相径庭呢？让我们先看看 setState 到底干了什么。

## setState 干了什么

![img](https://pic3.zhimg.com/80/4fd1a155faedff00910dfabe5de143fc_hd.jpg)

上面这个流程图是一个简化的 setState 调用栈，注意其中核心的状态判断，在[源码(ReactUpdates.js)](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/blob/35962a00084382b49d1f9e3bd36612925f360e5b/src/renderers/shared/reconciler/ReactUpdates.js%23L199)中

```JavaScript
function enqueueUpdate(component) {
  // ...

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
}
```

若 isBatchingUpdates 为 true，则把当前组件（即调用了 setState 的组件）放入 dirtyComponents 数组中；否则 batchUpdate 所有队列中的更新。先不管这个 batchingStrategy，看到这里大家应该已经大概猜出来了，文章一开始的例子中 4 次 setState 调用表现之所以不同，这里逻辑判断起了关键作用。

那么 *batchingStrategy* 究竟是何方神圣呢？其实它只是一个简单的对象，定义了一个 isBatchingUpdates 的布尔值，和一个 batchedUpdates 方法。下面是一段简化的定义代码：

```JavaScript
var batchingStrategy = {
  isBatchingUpdates: false,

  batchedUpdates: function(callback, a, b, c, d, e) {
    // ...
    batchingStrategy.isBatchingUpdates = true;
    
    transaction.perform(callback, null, a, b, c, d, e);
  }
};
```

注意 batchingStrategy 中的 **batchedUpdates** 方法中，有一个 transaction.perform 调用。这就引出了本文要介绍的核心概念 —— Transaction（事务）。

## 初识 Transaction

熟悉 MySQL 的同学看到 Transaction 是否会心一笑？然而在 React 中 Transaction 的原理和行为和 MySQL 中并不完全相同，让我们从源码开始一步步开始了解。

在 Transaction 的[源码](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/blob/6d5fe44c8602f666a043a4117ccc3bdb29b86e78/src/shared/utils/Transaction.js)中有一幅特别的 ASCII 图，形象的解释了 Transaction 的作用。

```
/*
 * 
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * 
 */
```

简单地说，一个所谓的 Transaction 就是将需要执行的 method 使用 wrapper 封装起来，再通过 Transaction 提供的 perform 方法执行。而在 perform 之前，先执行所有 wrapper 中的 initialize 方法；perform 完成之后（即 method 执行后）再执行所有的 close 方法。一组 initialize 及 close 方法称为一个 wrapper，从上面的示例图中可以看出 Transaction 支持多个 wrapper 叠加。

具体到实现上，React 中的 Transaction 提供了一个 Mixin 方便其它模块实现自己需要的事务。而要使用 Transaction 的模块，除了需要把 Transaction 的 Mixin 混入自己的事务实现中外，还需要额外实现一个抽象的 getTransactionWrappers 接口。这个接口是 Transaction 用来获取所有需要封装的前置方法（initialize）和收尾方法（close）的，因此它需要返回一个数组的对象，每个对象分别有 key 为 initialize 和 close 的方法。

下面是一个简单使用 Transaction 的例子

```JavaScript
var Transaction = require('./Transaction');

// 我们自己定义的 Transaction
var MyTransaction = function() {
  // do sth.
};

Object.assign(MyTransaction.prototype, Transaction.Mixin, {
  getTransactionWrappers: function() {
    return [{
      initialize: function() {
        console.log('before method perform');
      },
      close: function() {
        console.log('after method perform');
      }
    }];
  };
});

var transaction = new MyTransaction();
var testMethod = function() {
  console.log('test');
}
transaction.perform(testMethod);

// before method perform
// test
// after method perform
```

当然在实际代码中 React 还做了异常处理等工作，这里不详细展开。有兴趣的同学可以参考源码中 [Transaction](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/blob/401e6f10587b09d4e725763984957cf309dfdc30/src/shared/utils/Transaction.js) 实现。

说了这么多 Transaction，它到底是怎么导致上文所述 setState 的各种不同表现的呢？

## 解密 setState

那么 Transaction 跟 setState 的不同表现有什么关系呢？首先我们把 4 次 setState 简单归类，前两次属于一类，因为他们在同一次调用栈中执行；setTimeout 中的两次 setState 属于另一类，原因同上。让我们分别看看这两类 setState 的调用栈：

![img](https://pic1.zhimg.com/80/961aed5b866146dff1707fb0c43914d2_hd.jpg)

componentDidMout 中 setState 的调用栈

![img](https://pic1.zhimg.com/80/444c2862d8bb4be66ab2ceb370dcbe9c_hd.jpg)

setTimeout 中 setState 的调用栈

很明显，在 componentDidMount 中直接调用的两次 setState，其调用栈更加复杂；而 setTimeout 中调用的两次 setState，调用栈则简单很多。让我们重点看看第一类 setState 的调用栈，有没有发现什么熟悉的身影？没错，就是**batchedUpdates** 方法，原来早在 setState 调用前，已经处于 batchedUpdates 执行的 transaction 中！

那这次 batchedUpdate 方法，又是谁调用的呢？让我们往前再追溯一层，原来是 ReactMount.js 中的**_renderNewRootComponent** 方法。也就是说，整个将 React 组件渲染到 DOM 中的过程就处于一个大的 Transaction 中。

接下来的解释就顺理成章了，因为在 componentDidMount 中调用 setState 时，batchingStrategy 的 isBatchingUpdates 已经被设为 true，所以两次 setState 的结果并没有立即生效，而是被放进了 dirtyComponents 中。这也解释了两次打印this.state.val 都是 0 的原因，新的 state 还没有被应用到组件中。

再反观 setTimeout 中的两次 setState，因为没有前置的 batchedUpdate 调用，所以 batchingStrategy 的 isBatchingUpdates 标志位是 false，也就导致了新的 state 马上生效，没有走到 dirtyComponents 分支。也就是，setTimeout 中第一次 setState 时，this.state.val 为 1，而 setState 完成后打印时 this.state.val 变成了 2。第二次 setState 同理。

## 扩展阅读

在上文介绍 Transaction 时也提到了其在 React 源码中的多处应用，想必调试过 React 源码的同学应该能经常见到它的身影，像 initialize、perform、close、closeAll、notifyAll 等方法出现在调用栈里时，都说明当前处于一个 Transaction 中。

既然 Transaction 这么有用，我们自己的代码中能使用 Transaction 吗？很可惜，答案是不能。不过针对文章一开始例子中 setTimeout 里的两次 setState 导致两次 render 的情况，React 偷偷给我们暴露了一个 batchedUpdates 方法，方便我们调用。

```
import ReactDom, { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  this.setState(val: this.state.val + 1);
  this.setState(val: this.state.val + 1);
});
```

当然因为这个不是公开的 API，后续存在废弃的风险，大家在业务系统里慎用哟！

> dan 关于setState为什么是异步的解释https://github.com/facebook/react/issues/11527 









