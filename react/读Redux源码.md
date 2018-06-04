## 读Redux源码

>本文是[react进阶教程](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/redux-advanced-tutorial.md)的阅读笔记,参考了部分[ecmadao](https://github.com/ecmadao/Coding-Guide/blob/master/Notes/React/Redux/Redux%E5%85%A5%E5%9D%91%E8%BF%9B%E9%98%B6-%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.md)的博客在保留了原文的基础上加上了自己的一些理解,以及源码贴的都是最新版(2018-5-27)的代码,对比之前的代码有一点点变动.花时间自己修订一遍,为了加深点印象.



文件结构

```
├── utils/    # 忽略这部分
│     ├── actionTypes.js
│     ├── isPlainObject.js
│     ├── warning.js
├── applyMiddleware.js
├── bindActionCreators.js
├── combineReducers.js
├── compose.js
├── createStore.js
├── index.js  # 入口文件
```

### 1. compose(...functions)

这个函数没有依赖是个纯函数

```javascript
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
// 这个函数最终所达到的效果是: compose(f, g, h)(...arg) => f(g(h(...args)))
```

### 2. createStore(reducer,initialState,enhancer)

这是redux最关键的一部分

```JavaScript
import $$observable from 'symbol-observable'

import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'

/**
 * Creates a Redux store that holds the state tree.
 * 创建一个持有状态树的Redux存储
 * The only way to change the data in the store is to call `dispatch()` on it.
 * 改变 store 数据的唯一方法是调用 dispatch()
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 * 应用中应该只有一个 store ,为了指定状态树的不同部分如何响应动作，可以使用 combineReducers 将几个 reducer 组合成一个 reducer 函数。
 *================================================================
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 * reducer 函数,给出当前state和action,返回下一个state
 *================================================================
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 * 主要用于前后端同构时的数据同步
 *================================================================
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *可以实现中间件、时间旅行，持久化等
 * ※ Redux 仅提供 applyMiddleware 这个 Store Enhancer ※
 *================================================================
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
//================================================================

export default function createStore(reducer, preloadedState, enhancer) {
  
  // 这部分的作用在文末讲,这部分很关键!
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
	
    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentReducer = reducer
  let currentState = preloadedState     // 这就是整个应用的 state
  let currentListeners = []             // 用于存储订阅的回调函数，dispatch 后逐个执行
  let nextListeners = currentListeners  //【悬念1：为什么需要两个 存放回调函数 的变量？】
  let isDispatching = false

  /**
   * 【悬念1·解疑】
   * 试想，dispatch 后，回调函数正在乖乖地被逐个执行（for 循环进行时）
   * 假设回调函数队列原本是这样的 [a, b, c, d]
   *
   * 现在 for 循环执行到第 3 步，亦即 a、b 已经被执行，准备执行 c
   * 但在这电光火石的瞬间，a 被取消订阅！！！
   *
   * 那么此时回调函数队列就变成了 [b, c, d]
   * 那么第 3 步就对应换成了 d！！！
   * c 被跳过了！！！这就是躺枪。。。
   * 
   * 作为一个回调函数，最大的耻辱就是得不到执行
   * 因此为了避免这个问题，本函数会在上述场景中把
   * currentListeners 复制给 nextListeners
   *
   * 这样的话，dispatch 后，在逐个执行回调函数的过程中
   * 如果有新增订阅或取消订阅，都在 nextListeners 中操作
   * 让 currentListeners 中的回调函数得以完整地执行
   *
   * 既然新增是在 nextListeners 中 push，因此毫无疑问
   * 新的回调函数不会在本次 currentListeners 的循环体中被触发
   *
   * （上述事件发生的几率虽然很低，但还是严谨点比较好）
   */
  // 原作者把这个东西叫ensure哥,随他啦,跟着他叫
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {   //这里为什么要进行这个判断下面会说到
      nextListeners = currentListeners.slice()  
      // 把currentListeners 复制给 nextListeners,这个函数的意义就是为了避免上面的悬念1中的问题.
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   * getState的作用就是返回当前的state
   */
  function getState() {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }
   /**
   * 当正在执行reducer时不能获取state,并且报错输出错误信息到控制台
   */
    return currentState
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   *添加更改监听器。它将在任何时候被调用，
   *并且状态树的某些部分可能已经改变。你可以
   *调用`getState（）`来读取回调中的当前状态树。
   *
   *您可以使用以下命令从更改侦听器调用dispatch（）
   *注意事项：
   *
   * 1.订阅在每次 dispatch（） 调用之前被快照。
   * 如果您在调用侦听器时订阅或取消订阅，这对正在进行的 dispatch（）
   * 没有任何影响。然而，下一个 dispatch（） 调用，
   * 无论是否嵌套，都将使用订阅列表的更新近期快照。
   *
   * 2.监听器不应该期望看到所有的状态改变，因为在监听器被调用之前，
   * 状态可能已经在嵌套的 dispatch（） 中被多次更新。但是，
   * 它确保在 dispatch（） 开始之前注册的所有订户在退出时将被调用最新状态。

   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
//================================================================
   /**
   * 负责注册回调函数的老司机
   * 
   * 这里需要注意的就是，回调函数中如果需要获取 state
   * 那每次获取都请使用 getState()，而不是开头用一个变量缓存住它
   * 因为回调函数执行期间，有可能有连续几个 dispatch 让 state 改得物是人非
   * 而且别忘了，dispatch 之后，整个 state 是被完全替换掉的
   * 你缓存的 state 指向的可能已经是老掉牙的 state 了！！！
   *
   * @param  {函数} 想要订阅的回调函数
   * @return {函数} 取消订阅的函数
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.')
    }

    if (isDispatching) {
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
          'If you would like to be notified after the store has been updated, subscribe from a ' +
          'component and invoke store.getState() in the callback to access the latest state. ' +
          'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
        //在reducer执行时，不可以取消订阅。
      )
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()  // 调用 ensure 防止出现悬念一中的问题
    nextListeners.push(listener)    // 新增订阅在 nextListeners 中操作
		// 返回一个取消订阅的函数
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. ' +
            'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
        )
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)   // 取消订阅还是在 nextListeners 中操作
    }
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *改变state的唯一方法是 dispatch an action
   * 内部的实现是：往 reducer 中传入 currentState 以及 action
   * 用其返回值替换 currentState，最后逐个触发回调函数
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   * 用于创建 store 的 reducer 函数将被当前状态树和给定的 action 调用。
   * 它的返回值将被视为state的下一个状态，并且更改监听器将被通知。
   * 基本实现仅支持普通对象操作。如果你想分派Promise，Observable，Thunk或其他东西，
   * 你需要将你的store创建功能包装到相应的中间件中。
   * 例如，请参阅`redux-thunk`软件包的文档。即使是中间件也会使用这种方法最终发送简单的对象动作。
   *=================================================================
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   *如果使用了自定义中间件，它可能会将 dispatch（） 包装为
   *返回其他东西（例如，Promise）。
   * 如果 dispatch 的不是一个对象类型的 action（同步的），而是 Promise / thunk（异步的）
   * 则需引入 redux-thunk 等中间件来反转控制权【悬念2：什么是反转控制权？】
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
          'Use custom middleware for async actions.'
        // Action必须是简单的对象,使用自定义的中间件来实现异步Action
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      // 关键点：currentState 与 action 会流通到所有的 reducer
      // 所有 reducer 的返回值整合后，替换掉当前的 currentState
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
		// 令 currentListeners 等于 nextListeners，表示正在逐个执行回调函数（这就是上面 ensure 哥的判定条件）
    const listeners = (currentListeners = nextListeners)
    // 逐个触发回调函数
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
      //  listener 中间变量避免了 this 指向 listeners 而造成泄露的问题 
    }

    return action // 为了方便链式调用，dispatch 执行完毕后，返回 action（下文会提到的，稍微记住就好了）
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * 替换当前 reducer 的老司机
   * 主要用于代码分离按需加载、热替换等情况
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE }) // 触发生成新的 state 树
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
   /**
   * 这是留给 可观察/响应式库 的接口（详情 https://github.com/zenparsing/es-observable）
   * 如果您了解 RxJS 等响应式编程库，那可能会用到这个接口，否则请略过
   * @return {observable}
   */
  function observable() {
    const outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  // 这里 dispatch 只是为了生成 应用初始状态
  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

【悬念2：什么是反转控制权？ · 解疑】
在同步场景下，dispatch(action) 的这个 action 中的数据是同步获取的，并没有控制权的切换问题
但异步场景下，则需要将 dispatch 传入到回调函数。待异步操作完成后，回调函数自行调用 dispatch(action)

说白了：在异步 Action Creator 中自行调用 dispatch 就相当于反转控制权
您完全可以自己实现，也可以借助 redux-thunk / redux-promise 等中间件统一实现
（它们的作用也仅仅就是把 dispatch 等传入异步 Action Creator 罢了）

> 拓展阅读：阮老师的 Thunk 函数的含义与用法



### 3. combineReducers(reducers)

Flux 中是根据不同的功能拆分出多个 `store` 分而治之 而 Redux 只允许应用中有唯一的 `store`，通过拆分出多个 `reducer` 分别管理对应的 `state`

无论您的应用状态树有多么的复杂，都可以通过逐层下分管理对应部分的 `state`：

```
                                 counterReducer(counter, action) -------------------- counter
                              ↗                                                              ↘
rootReducer(state, action) —→∑     ↗ optTimeReducer(optTime, action) ------ optTime ↘         nextState
                              ↘—→∑                                                    todo  ↗
                                   ↘ todoListReducer(todoList,action) ----- todoList ↗


注：左侧表示 dispatch 分发流，∑ 表示 combineReducers；右侧表示各实体 reducer 的返回值，最后汇总整合成 nextState
```

看了上图，您应该能直观感受到为何取名为 `reducer` 了吧？把 `state` 分而治之，极大减轻开发与维护的难度

> 无论是 `dispatch` 哪个 `action`，都会流通**所有的** `reducer`
> 表面上看来，这样子很浪费性能，但 JavaScript 对于这种**纯函数**的调用是很高效率的，因此请尽管放心
> 这也是为何 `reducer` 必须返回其对应的 `state` 的原因。否则整合状态树时，该 `reducer` 对应的键值就是 `undefined`

### 

```JavaScript
export default function combineReducers(reducers) {
  //Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，
  //数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 
  //（两者的主要区别是 一个 for-in 循环还会枚举其原型链上的属性）。
  // 第一次筛选，参数reducers为Object
  // 筛选掉reducers中不是function的键值对
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)
  // 二次筛选，判断reducer中传入的值是否合法
  // 获取筛选完之后的所有key
  
  // 这里删了一段遇到错误抛出异常的代码,忽略它
  
    let hasChanged = false
    const nextState = {}
	// 遍历所有的key和reducer，分别将reducer对应的key所代表的state，代入到reducer中进行函数调用
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]                       // 获取当前子 state
      const nextStateForKey = reducer(previousStateForKey, action) // 执行各子 reducer 中获取子 nextState
			if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      // 将子 nextState 挂载到对应的键名
      nextState[key] = nextStateForKey
      // 如果任一state有更新则hasChanged为true
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
```

### 4.  bindActionCreators(actionCreators, dispatch)

> 这个 API 有点鸡肋，它无非就是做了这件事情：`dispatch(ActionCreator(XXX))`

```JavaScript
/* 为 Action Creator 加装上自动 dispatch 技能 */
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments))
  }
}

export default function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      // 逐个装上自动 dispatch 技能
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```

这个东西几乎用不到

### 5. applyMiddleware(...middlewares)

首先要理解何谓 `Middleware`，何谓 `Enhancer`

#### Middleware

说白了，Redux 引入中间件机制，其实就是为了在 `dispatch` 前后，**统一**“做爱做的事”。。。
诸如统一的日志记录、引入 thunk 统一处理异步 Action Creator 等都属于中间件

下面是一个简单的打印动作前后 `state` 的中间件：

```JavaScript
/* 装逼写法 */
const printStateMiddleware = ({ getState }) => next => action => {
  console.log('state before dispatch', getState())
  
  let returnValue = next(action)

  console.log('state after dispatch', getState())

  return returnValue
}

-------------------------------------------------

/* 降低逼格写法 */
function printStateMiddleware(middlewareAPI) { // 记为【锚点-1】，中间件内可用的 API
  return function (dispatch) {                 // 记为【锚点-2】，传入上级中间件处理逻辑（若无则为原 store.dispatch）

    // 下面记为【锚点-3】，整个函数将会被传到下级中间件（如果有的话）作为它的 dispatch 参数
    return function (action) { // <---------------------------------------------- 这货就叫做【中间件处理逻辑哥】吧
      console.log('state before dispatch', middlewareAPI.getState())
  
      var returnValue = dispatch(action) // 还记得吗，dispatch 的返回值其实还是 action
  
      console.log('state after dispatch', middlewareAPI.getState())

      return returnValue // 将 action 返回给上一个中间件（实际上可以返回任意值，或不返回）
    }
  }
}
```

### Store Enhancer

说白了，Store 增强器就是对生成的 `store` API 进行改造，这是它与中间件最大的区别（中间件不修改 `store` 的 API）
而改造 `store` 的 API 就要从它的缔造者 `createStore` 入手。例如，Redux 的 API `applyMiddleware` 就是一个 Store 增强器：

```JavaScript
import compose from './compose' // 这货的作用其实就是 compose(f, g, h)(action) => f(g(h(action)))

/* 传入一坨中间件 */
export default function applyMiddleware(...middlewares) {

  /* 传入 createStore */
  return function(createStore) {
  
    /* 返回一个函数签名跟 createStore 一模一样的函数，亦即返回的是一个增强版的 createStore */
    return function(reducer, preloadedState, enhancer) {
    
      // 用原 createStore 先生成一个 store，其包含 getState / dispatch / subscribe / replaceReducer 四个 API
      var store = createStore(reducer, preloadedState, enhancer)
      
      var dispatch = store.dispatch // 指向原 dispatch
      var chain = [] // 存储中间件的数组
  
      // 提供给中间件的 API（其实都是 store 的 API）
      var middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
      }
      
      // 给中间件“装上” API，见上面 Middleware【降低逼格写法】的【锚点-1】 
      chain = middlewares.map(middleware => middleware(middlewareAPI))
      
      // 串联所有中间件
      dispatch = compose(...chain)(store.dispatch)
      // 例如，chain 为 [M3, M2, M1]，而 compose 是从右到左进行“包裹”的
      // 那么，M1 的 dispatch 参数为 store.dispatch（见【降低逼格写法】的【锚点-2】）
      // 往后，M2 的 dispatch 参数为 M1 的中间件处理逻辑哥（见【降低逼格写法】的【锚点-3】）
      // 同样，M3 的 dispatch 参数为 M2 的中间件处理逻辑哥
      // 最后，我们得到串联后的中间件链：M3(M2(M1(store.dispatch)))
      //（这种形式的串联类似于洋葱，可参考文末的拓展阅读：中间件的洋葱模型）
  
      return {
        ...store, // store 的 API 中保留 getState / subsribe / replaceReducer
        dispatch  // 新 dispatch 覆盖原 dispatch，往后调用 dispatch 就会触发 chain 内的中间件链式串联执行
      }
    }
  }
}
```

最终返回的虽然还是 `store` 的那四个 API，但其中的 `dispatch` 函数的功能被增强了，这就是所谓的 Store Enhancer.

如果有多个中间件以及多个增强器，可以这样写（请留意序号顺序）：

> 重温一下 `createStore` 完整的函数签名：`function createStore(reducer, preloadedState, enhancer)`

```JavaScript
/** 本代码块记为 code-11 **/
import { createStore, applyMiddleware, compose } from 'redux'

const store = createStore(
  reducer,
  preloadedState,    // 可选，前后端同构的数据同步
  compose(           // 还记得吗？compose 是从右到左的哦！
    applyMiddleware( // 这货也是 Store Enhancer 哦！但这是关乎中间件的增强器，必须置于 compose 执行链的最后
      middleware1,
      middleware2,
      middleware3
    ),
    enhancer3,
    enhancer2,
    enhancer1
  )
)
// 因为 Redux 仅提供 applyMiddleware 这个 Store Enhancer
// 所以一般代码的样子是下面这样的
const store = createStore(
  reducer,
  preloadedState,    // 可选，前后端同构的数据同步
  applyMiddleware( 
    middleware1,
    middleware2,
    middleware3
  )
)
```

为什么会支持那么多种写法呢？在 `createStore` 的源码分析的开头部分，我省略了一些代码，现在奉上该压轴部分：

```JavaScript
/** 本代码块记为 code-12 **/
if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
  // 这里就是上面 code-10 的情况，只传入 reducer 和 Store Enhancer 这两个参数
  enhancer = preloadedState
  preloadedState = undefined
}

if (typeof enhancer !== 'undefined') {
  if (typeof enhancer !== 'function') {
    throw new Error('Expected the enhancer to be a function.')
  }
  // 存在 enhancer 就立即执行，返回增强版的 createStore <--------- 记为【锚点 12-1】
  return enhancer(createStore)(reducer, preloadedState)
}

if (typeof reducer !== 'function') {
  throw new Error('Expected the reducer to be a function.')
}

// 除 compose 外，createStore 竟然也在此为我们提供了书写的便利与自由度，实在是太体贴了
```

如果像 `code-11` 那样有多个 `enhancer`，则 `code-12 【锚点 12-1】` 中的代码会执行多次
生成最终的超级增强版 `store`。最后，奉上 `code-11` 中 `compose` 内部的执行顺序示意图：

```
原 createStore ————
                  │
                  ↓
return enhancer1(createStore)(reducer, preloadedState, enhancer2)
   |
   ├———————→ createStore 增强版 1
                    │
                    ↓
return enhancer2(createStore1)(reducer, preloadedState, enhancer3)
   |
   ├———————————→ createStore 增强版 1+2
                        │
                        ↓
return enhancer3(createStore1+2)(reducer, preloadedState, applyMiddleware(m1,m2,m3))
   |
   ├————————————————————→ createStore 增强版 1+2+3
                                     │
                                     ↓
return appleMiddleware(m1,m2,m3)(createStore1+2+3)(reducer, preloadedState)
   |
   ├——————————————————————————————————→ 生成最终增强版 store
```

------

### 总结

Redux 有五个 API，分别是：

- `createStore(reducer, [initialState])`
- `combineReducers(reducers)`
- `applyMiddleware(...middlewares)`
- `bindActionCreators(actionCreators, dispatch)`
- `compose(...functions)`

`createStore` 生成的 `store` 有四个 API，分别是：

- `getState()`
- `dispatch(action)`
- `subscribe(listener)`
- `replaceReducer(nextReducer)`

延伸阅读 : [中间件的洋葱模型](https://github.com/kenberkeley/redux-simple-tutorial/blob/master/middleware-onion-model.md)