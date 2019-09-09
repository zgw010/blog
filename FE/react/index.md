React的定位是一个构建用户界面的JavaScript类库，它使用JavaScript语言开发UI组件，可以使用多种方式渲染这些组件，输出用户界面，较大程度的达到了跨技术栈跨平台的兼容重用：

> We don’t make assumptions about the rest of your technology stack, so you can develop new features in React without rewriting existing code.

React can do its job better if it “knows” about your components rather than if it only sees the React element tree after recursively callin

React 使用了控制反转来调用组件, ( `<Form/>` 而不是 `Form()` )

React核心内容只涉及如何定义组件，并不涉及具体的组件渲染（即输出用户界面），这需要额外引入渲染模块，以渲染React定义的组件：

React核心内容也确实只包括定义组件相关的内容和API ，实际项目中，可以看到首先需要使用如下代码：

```
import React from 'react';
```

这句代码做的就是引入了React核心源码模块。

React DOM渲染模块：将React组件渲染为DOM，然后可以被浏览器处理呈现给用户，这就是通常在web应用中引入的`react-dom`模块：

```
import React from 'react';
import { render } from 'react-dom';
import App from './apps/App.js';

render(
 <App />,
 document.getElementById('mainBox')
);
```

如上代码，`App`是使用React核心模块定义的组件，然后使用`react-dom`渲染模块提供的`render`方法将其渲染为DOM输出至页面。

**web React应用是最常见的，也是最易于理解的，所以本篇后文均从React-DOM渲染器角度解析Fiber。**

## 调和（Reconciliation）

如前面两节所述，React核心是定义组件，渲染组件方式由环境决定，组件状态管理，生命周期方法管理，组件更新等应该跨平台一致处理，不受渲染环境影响，这部分内容统一由[调和器（Reconciler）](https://github.com/facebook/react/tree/master/packages/react-reconciler)处理 , 不同渲染器都会使用该模块。调和器主要作用就是在组件状态变更时，调用组件树各组件的`render`方法，渲染，卸载组件。

### Stack Reconciler

我们知道浏览器渲染引擎是单线程的，在React 15.x版本及之前版本，计算组件树变更时将会阻塞整个线程，整个渲染过程是连续不中断完成的，而这时的其他任务都会被阻塞，如动画等，这可能会使用户感觉到明显卡顿，比如当你在访问某一网站时，输入某个搜索关键字，更优先的应该是交互反馈或动画效果，如果交互反馈延迟200ms，用户则会感觉较明显的卡顿，而数据响应晚200毫秒并没太大问题。这个版本的调和器可以称为栈调和器（Stack Reconciler），其调和算法大致过程见[React Diff算法](http://blog.codingplayboy.com/2016/10/27/react_diff/) 和[React Stack Reconciler实现](https://reactjs.org/docs/implementation-notes.html)。

Stack Reconcilier的主要缺陷就是不能暂停渲染任务，也不能切分任务，无法有效平衡组件更新渲染与动画相关任务间的执行顺序，即不能划分任务优先级，有可能导致重要任务卡顿，动画掉帧等问题。

 Fiber Reconciler

React 16版本提出了一个更先进的调和器，它允许渲染进程分段完成，而不必须一次性完成，中间可以返回至主进程控制执行其他任务。而这是通过计算部分组件树的变更，并暂停渲染更新，询问主进程是否有更高需求的绘制或者更新任务需要执行，这些高需求的任务完成后才开始渲染。这一切的实现是在代码层引入了一个新的数据结构-Fiber对象，每一个组件实例对应有一个fiber实例，此fiber实例负责管理组件实例的更新，渲染任务及与其他fiber实例的联系。

这个新推出的调和器就叫做纤维调和器（Fiber Reconciler），它提供的新功能主要有：

1. 可切分，可中断任务；
2. 可重用各分阶段任务，且可以设置优先级；
3. 可以在父子组件任务间前进后退切换任务；
4. `render`方法可以返回多元素（即可以返回数组）；
5. 支持异常边界处理异常；

## Fiber与JavaScript

前面说到Fiber可以异步实现不同优先级任务的协调执行，那么对于DOM渲染器而言，在JavaScript层是否提供这种方式呢，还是说只能使用setTimeout模拟呢？目前新版本主流浏览器已经提供了可用API：`requestIdleCallback`和`requestAnimationFrame`:

1. [requestIdleCallback](https://www.w3.org/TR/requestidlecallback/): 在线程空闲时期调度执行低优先级函数；
2. [requestAnimationFrame](https://www.w3.org/TR/animation-timing/): 在下一个动画帧调度执行高优先级函数；

 空闲期（Idle Period）

通常，客户端线程执行任务时会以帧的形式划分，大部分设备控制在30-60帧是不会影响用户体验；在两个执行帧之间，主线程通常会有一小段空闲时间，`requestIdleCallback`可以在这个**空闲期（Idle Period）**调用**空闲期回调（Idle Callback）**，执行一些任务。

 Fiber与requestIdleCallback

Fiber所做的就是需要分解渲染任务，然后根据优先级使用API调度，异步执行指定任务：

1. 低优先级任务由`requestIdleCallback`处理；
2. 高优先级任务，如动画相关的由`requestAnimationFrame`处理；
3. `requestIdleCallback`可以在多个空闲期调用空闲期回调，执行任务；
4. `requestIdleCallback`方法提供deadline，即任务执行限制时间，以切分任务，避免长时间执行，阻塞UI渲染而导致掉帧；

## Fiber与组件

我们已经知道了Fiber的功能及其主要特点，那么其如何和组件联系，并且如何实现效果的呢，以下几点可以概括：

1. React应用中的基础单元是组件，应用以组件树形式组织，渲染组件；
2. Fiber调和器基础单元则是fiber（调和单元），应用以fiber树形式组织，应用Fiber算法；
3. 组件树和fiber树结构对应，一个组件实例有一个对应的fiber实例；
4. Fiber负责整个应用层面的调和，fiber实例负责对应组件的调和；

**注意Fiber与fiber的区别，Fiber是指调和器算法，fiber则是调和器算法组成单元，和组件与应用关系类似，每一个组件实例会有对应的fiber实例负责该组件的调和。**

## Fiber数据结构

截止目前，我们对Fiber应该有了初步的了解，在具体介绍Fiber的实现与架构之前，准备先简单介绍一下Fiber的数据结构，数据结构能一定程度反映其整体工作架构。

其实，一个fiber就是一个JavaScript对象，以键值对形式存储了一个关联组件的信息，包括组件接收的props，维护的state，最后需要渲染出的内容等。接下来我们将介Fiber对象的主要属性。

### Fiber对象

首先[Fiber对象](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiber.js)的定义如下：

```
// 一个Fiber对象作用于一个组件
export type Fiber = {|
  // 标记fiber类型tag.
  tag: TypeOfWork,
  // fiber对应的function/class/module类型组件名.
  type: any,
  // fiber所在组件树的根组件FiberRoot对象
  stateNode: any,
  // 处理完当前fiber后返回的fiber，
  // 返回当前fiber所在fiber树的父级fiber实例
  return: Fiber | null,
  // fiber树结构相关链接
  child: Fiber | null,
  sibling: Fiber | null,
  index: number,

  // 当前处理过程中的组件props对象
  pendingProps: any, 
  // 缓存的之前组件props对象
  memoizedProps: any, // The props used to create the output.
  // The state used to create the output
  memoizedState: any,

  // 组件状态更新及对应回调函数的存储队列
  updateQueue: UpdateQueue<any> | null,


  // 描述当前fiber实例及其子fiber树的数位，
  // 如，AsyncUpdates特殊字表示默认以异步形式处理子树，
  // 一个fiber实例创建时，此属性继承自父级fiber，在创建时也可以修改值，
  // 但随后将不可修改。
  internalContextTag: TypeOfInternalContext,

  // 更新任务的最晚执行时间
  expirationTime: ExpirationTime,

  // fiber的版本池，即记录fiber更新过程，便于恢复
  alternate: Fiber | null,

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
|};
```

 

type & key：同React元素的值；
type：描述fiber对应的React组件；
	对于组合组件：值为function或class组件本身；
	对于原生组件（div等）：值为该元素类型字符串；
key：调和阶段，标识fiber，以检测是否可重用该fiber实例；
child & sibling：组件树，对应生成fiber树，类比的关系；
pendingProps & memoizedProps：分别表示组件当前传入的及之前的props；
return：返回当前fiber所在fiber树的父级fiber实例，即当前组件的父组件对应的fiber；
alternate：fiber的版本池，即记录fiber更新过程，便于恢复重用；
workInProgress：正在处理的fiber，概念上叫法，实际上没有此属性；

#### ALTERNATE FIBER

可以理解为一个fiber版本池，用于交替记录组件更新（切分任务后变成多阶段更新）过程中fiber的更新，因为在组件更新的各阶段，更新前及更新过程中fiber状态并不一致，在需要恢复时（如，发生冲突），即可使用另一者直接回退至上一版本fiber。

> 1. 使用alternate属性双向连接一个当前fiber和其work-in-progress，当前fiber实例的alternate属性指向其work-in-progress，work-in-progress的alternate属性指向当前稳定fiber；
> 2. 当前fiber的替换版本是其work-in-progress，work-in-progress的交替版本是当前fiber；
> 3. 当work-in-progress更新一次后，将同步至当前fiber，然后继续处理，同步直至任务完成；
> 4. work-in-progress指向处理过程中的fiber，而当前fiber总是维护处理完成的最新版本的fiber。

 创建FIBER实例

创建fiber实例即返回一个带有上一小节描述的诸多属性的JavaScript对象，`FiberNode`即根据传入的参数构造返回一个初始化的对象：

```
var createFiber = function(
  tag: TypeOfWork,
  key: null | string,
  internalContextTag: TypeOfInternalContext,
) {
  return new FiberNode(tag, key, internalContextTag);
};
```

创建alternate fiber以处理任务的实现如下：

```
// 创建一个alternate fiber处理任务
export function createWorkInProgress(
  current: Fiber,
  pendingProps: any,
  expirationTime: ExpirationTime,
) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(
      current.tag,
      current.key,
      current.internalContextTag,
    );
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    // 形成alternate关系，互相交替模拟版本池
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } 

  workInProgress.expirationTime = expirationTime;
  workInProgress.pendingProps = pendingProps;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  ...
  return workInProgress;
}
```

 Fiber类型

上一小节，Fiber对象中有个`tag`属性，标记fiber类型，而fiber实例是和组件对应的，所以其类型基本上对应于组件类型，源码见[ReactTypeOfWork模块](https://github.com/facebook/react/blob/master/packages/shared/ReactTypeOfWork.js)：

```
export type TypeOfWork = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const IndeterminateComponent = 0; // 尚不知是类组件还是函数式组件
export const FunctionalComponent = 1; // 函数式组件
export const ClassComponent = 2; // Class类组件
export const HostRoot = 3; // 组件树根组件，可以嵌套
export const HostPortal = 4; // 子树. Could be an entry point to a different renderer.
export const HostComponent = 5; // 标准组件，如地div， span等
export const HostText = 6; // 文本
export const CallComponent = 7; // 组件调用
export const CallHandlerPhase = 8; // 调用组件方法
export const ReturnComponent = 9; // placeholder（占位符）
export const Fragment = 10; // 片段
```

在调度执行任务的时候会根据不同类型fiber，即fiber.tag值进行不同处理。

 FiberRoot对象

`FiberRoot`对象，主要用来管理组件树组件的更新进程，同时记录组件树挂载的DOM容器相关信息，具体定义见[ReactFiberRoot模块](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberRoot.js)：

```
export type FiberRoot = {
  // fiber节点的容器元素相关信息，通常会直接传入容器元素
  containerInfo: any,
  // 当前fiber树中激活状态（正在处理）的fiber节点，
  current: Fiber,
  // 此节点剩余的任务到期时间
  remainingExpirationTime: ExpirationTime,
  // 更新是否可以提交
  isReadyForCommit: boolean,
  // 准备好提交的已处理完成的work-in-progress
  finishedWork: Fiber | null,
  // 多组件树FirberRoot对象以单链表存储链接，指向下一个需要调度的FiberRoot
  nextScheduledRoot: FiberRoot | null,
};
```

 创建FIBERROOT实例

```
import {
  ClassComponent,
  HostRoot
} from 'shared/ReactTypeOfWork';

// 创建返回一个初始根组件对应的fiber实例
function createHostRootFiber(): Fiber {
  // 创建fiber
  const fiber = createFiber(HostRoot, null, NoContext);
  return fiber;
}

export function createFiberRoot(
  containerInfo: any,
  hydrate: boolean,
) {
  // 创建初始根组件对应的fiber实例
  const uninitializedFiber = createHostRootFiber();
  // 组件树根组件的FiberRoot对象
  const root = {
    // 根组件对应的fiber实例
    current: uninitializedFiber,
    containerInfo: containerInfo,
    pendingChildren: null,
    remainingExpirationTime: NoWork,
    isReadyForCommit: false,
    finishedWork: null,
    context: null,
    pendingContext: null,
    hydrate,
    nextScheduledRoot: null,
  };
  // 组件树根组件fiber实例的stateNode指向FiberRoot对象
  uninitializedFiber.stateNode = root;
  return root;
}
```

### ReactChildFiber

在生成组件树的FiberRoot对象后，会为子组件生成各自的fiber实例，这一部分由[ReactChildFiber模块](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactChildFiber.js)实现：

```
// 调和（处理更新）子fibers
export const reconcileChildFibers = ChildReconciler(true);
// 挂载（初始化）子fibers
export const mountChildFibers = ChildReconciler(false);
```

而`ChildReconciler`方法所做的则是根据传入参数判断是调用初始化子组件fibers逻辑还是执行调和已有子组件fibers逻辑。

`ChildReconciler`方法，返回`reconcileChildFibers`方法：

1. 判断子级传递内容的数据类型，执行不同的处理，这也对应着我们写React组件时传递`props.children`时，其类型可以是对象或数组，字符串，是数字等；
2. 然后具体根据子组件类型，调用不同的具体调和处理函数；
3. 最后返回根据子组件创建或更新得到的fiber实例；

```
function ChildReconciler(a) {
  function reconcileChildFibers(
    returnFiber: Fiber, currentFirstChild: Fiber | null,
    newChild: any, expirationTime: ExpirationTime,
  ) {
    // Handle object types
    const isObject = typeof newChild === 'object' && newChild !== null;

    if (isObject) {
      // 子组件实例类型，以Symbol符号表示的
      switch (newChild.$$typeof) {
        // React Element
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber, currentFirstChild,
              newChild, expirationTime
            )
          );
        // React组件调用
        case REACT_CALL_TYPE:
          return placeSingleChild(reconcileSingleCall(...));
        // placeholder
        case REACT_RETURN_TYPE:
          return ...;
        case REACT_PORTAL_TYPE:
          return ...;
      }
    }
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(...));
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(...);
    }
    if (getIteratorFn(newChild)) {
      return reconcileChildrenIterator(...);
    }
    ...   
  }
}
```

太长了看不完,也看不懂,等过段时间水平高点接着看

http://blog.codingplayboy.com/2017/12/02/react_fiber/