什么是 fiber ?

React `Fiber` 并不是所谓的纤程（微线程、协程），而是一种基于浏览器的单线程调度算法，背后的支持 API 是大名鼎鼎的： `requestIdleCallback` ，得到了这个 API 的支持，我们便可以将 React 中最耗时的部分放入其中。

**window.requestIdleCallback()**会在浏览器空闲时期依次调用函数， 这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这样延迟触发而且关键的事件产生影响。函数一般会按先进先调用的顺序执行，除非函数在浏览器调用它之前就到了它的超时时间。
一种将 recocilation （一致性比较,递归 diff ），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（ 16ms ）内，还有没有足够的时间允许计算。
![](/home/hasaki/app/blog/imgs/requestIdleCallback.jpg)
1. 用户调用 ReactDOM.render 方法，传入例如<App />组件，React 开始运作<App />
1. <App /> 在内部会被转换成 RootFiber 节点，一个特殊的节点，并记录在一个全局变量中，TopTree
1. 拿到 <App /> 的 RootFiber ，首先创建一个 <App /> 对应的 Fiber ，然后加上 Fiber 信息，以便之后回溯。随后，赋值给之前的全局变量 TopTree
1. 使用 requestIdleCallback 重复第三个步骤，直到循环到树的所有节点
1. 最后完成了 diff 阶段，一次性将变化更新到真实 DOM 中，以防止 UI 展示的不连续性

其中，重点就是 3 和 4 阶段，这两个阶段将创建真实 DOM 和组件渲染 （ render ）拆分为无数的小碎块，使用 requestIdleCallback 连续进行。在 React 15 的时候，渲染、创建、插入、删除等操作是最费时的，在 React 16 中将渲染、创建抽离出来分片，这样性能就得到了极大的提升。
那为什么更新到真实 DOM 中不能拆分呢？理论上来说，是可以拆分的，但是这会造成 UI 的不连续性，极大的影响体验。

一个 `Fiber` 数据结构比较复杂

```
const Fiber = {
  tag: HOST_COMPONENT,
  type: 'div',
  return: parentFiber,
  child: childFiber,
  sibling: null,
  alternate: currentFiber,
  stateNode: document.createElement('div') | instance,
  props: { children: [], className: 'foo' },
  partialState: null,
  effectTag: PLACEMENT,
  effects: []
}
```

这是一个比较完整的 `Fiber object`，他复杂的原因是因为一个 `Fiber` 就代表了一个「正在执行或者执行完毕」的操作单元。这个概念不是那么好理解，如果要说得简单一点就是：以前的 `VDOM` 树节点的升级版。让我们介绍几个关键属性：

- 由「 递归改循环 」我们可以得知，当我们循环的遍历树到达底部时，需要回到其父节点，那么对应的就是 `Fiber` 中的 `return` 属性（以前叫 `parent` ）。 `child` 和 `sibling` 类似，代表这个 `Fiber` 的子 `Fiber` 和兄弟 `Fiber`
- `stateNode` 这个属性比较特殊，用于记录当前 `Fiber` 所对应的真实 `DOM` 节点 或者 当前虚拟组件的实例，这么做的原因第一是为了实现 `Ref` ，第二是为了实现 `DOM` 的跟踪
- `tag` 属性在新版的 `React` 中一共有 14 种值，分别代表了不同的 `JSX` 类型。
- `effectTag` 和 `effects` 这两个属性为的是记录每个节点 `Diff` 后需要变更的状态，比如删除，移动，插入，替换，更新等...

 

 

 

 