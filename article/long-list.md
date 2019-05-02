## 长列表解决方案
完整渲染的长列表基本上很难达到业务上的要求的，非完整渲染的长列表一般有两种方式：

懒渲染：这个就是常见的无限滚动的，每次只渲染一部分（比如 10 条），等剩余部分滚动到可见区域，就再渲染另一部分。

可视区域渲染：只渲染可见部分，不可见部分不渲染。

## 预备知识
[浏览器渲染过程](https://sylvanassun.github.io/2017/10/03/2017-10-03-BrowserCriticalRenderingPath/#comments)

[浏览器的渲染：过程与原理](https://juejin.im/entry/59e1d31f51882578c3411c77)

[scrollTop](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollTop)
上面两篇文章虽然写的不错, 但是依然有些小错误和盲点, 下面三篇是补充.

[结论](http://www.cnblogs.com/dojo-lzz/p/3983335.html)

[script 的 async 和 defer](https://segmentfault.com/q/1010000000640869)

[css加载会造成阻塞吗？](https://juejin.im/post/5b88ddca6fb9a019c7717096)

[更详细的关于浏览器进程线程的介绍](https://segmentfault.com/a/1190000012925872)

## 处理长列表的轮子
[react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list) 相对较为轻量, 功能比 react-virtualized 少, 几乎不更新了, 上次更新还是一年前

[react-virtualized](https://github.com/bvaughn/react-virtualized) 比 react-tiny-virtual-list 全面, 也更大, 更新缓慢, 可能作者把精力放到新的 react-window 上了.

[react-window](https://github.com/bvaughn/react-window) react-virtualized 的轻量版, 是 react-virtualized 原作者开发的, 持续维护中

## react-tiny-virtual-list的源码解读
https://github.com/dwqs/blog/issues/71