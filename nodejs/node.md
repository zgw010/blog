# Node.js 是一个基于 [Chrome V8](https://v8.dev/) 引擎 的 JavaScript 运行时。
## Node.js 核心概念
### [阻塞对比非阻塞一览](https://nodejs.org/zh-cn/docs/guides/blocking-vs-non-blocking/)
### [Node.js 事件轮询，定时器 和 process.nextTick()](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
### [不要阻塞你的事件轮询（或是工作池）](https://nodejs.org/zh-cn/docs/guides/dont-block-the-event-loop/)
### [Node.js 中的定时器](https://nodejs.org/zh-cn/docs/guides/timers-in-node/)

要理解事件循环, 首先明白微任务和宏任务有哪些

宏任务主要包含：script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、setImmediate(Node.js 环境)

微任务主要包含：Promise、MutaionObserver、process.nextTick(Node.js 环境)

补充一个闭包的作用:
> 不要让复杂的计算阻塞事件循环
>
>假设你想在 JavaScript 处理一个复杂的计算，而又不想阻塞事件循环。 你有两种选择：任务拆分或任务分流。
>
> 任务拆分
>
>你可以把你的复杂计算 拆分开，然后让每个计算分别运行在事件循环中，不过你要定期地让其它一些等待的事件执行就会。 在 JavaScript 中，用闭包很容易实现保存执行的上下文.

Node 有两种类型的线程：一个事件循环线程和 k 个工作线程。 事件循环负责 JavaScript 回调和非阻塞 I/O，工作线程执行与 C++ 代码对应的、完成异步请求的任务，包括阻塞 I/O 和 CPU 密集型工作。 这两种类型的线程一次都只能处理一个活动。 如果任意一个回调或任务需要很长时间，则运行它的线程将被 阻塞。 如果你的应用程序发起阻塞的回调或任务，在好的情况下这可能只会导致吞吐量下降（客户端/秒），而在最坏情况下可能会导致完全拒绝服务。

要编写高吞吐量、防 DoS 攻击的 web 服务，您必须确保不管在良性或恶意输入的情况下，您的事件循环线程和您的工作线程都不会阻塞。

事件循环, 观察者, 请求对象, I/O线程池 这四者共同构成了 Node 异步 I/O 模型的基本要素.

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

事件驱动的本质: 通过主循环加事件触发的方式来运行程序.

定时器*：本阶段执行已经安排的 setTimeout() 和 setInterval() 的回调函数。

    setTimeout() 会采用红黑树来存储定时器
*待定回调*：执行延迟到下一个循环迭代的 I/O 回调。

*idle, prepare*：仅系统内部使用。

*轮询*：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。

*检测*：setImmediate() 回调函数在这里执行。

*关闭的回调函数*：一些准备关闭的回调函数，如：socket.on('close', ...)。
在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则关闭干净。

*process.nextTick()*: 在技术上不是事件循环的一部分。相反，无论事件循环的当前阶段如何，都将在当前操作完成后处理 nextTickQueue。

    `process.nextTick()` 的优先级高于 `setImmediate()` , `process.nextTick()` 的回调函数放在一个数组中,并且在每轮循环中会将数组中的回调函数全部执行完, `setImmediate()` 的结果放在链表里,在每轮循环中只会执行一个回调.

