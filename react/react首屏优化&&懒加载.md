## 缓存
1. expires

`expires: Thu, 16 May 2019 03:05:59 GMT`
在 http 头中设置一个过期时间，在这个过期时间之前，浏览器的请求都不会发出，而是自动从缓存中读取文件，除非缓存被清空，或者强制刷新。缺陷在于，服务器时间和用户端时间可能存在不一致，所以 HTTP/1.1 加入了 cache-control 头来改进这个问题。

2. cache-control

`cache-control: max-age=31536000`
设置过期的时间长度（秒），在这个时间范围内，浏览器请求都会直接读缓存。当 expires 和 cache-control 都存在时，expires 的优先级更高。

3. last-modified / if-modified-since
这是一组请求/相应头

响应头：

`last-modified: Wed, 16 May 2018 02:57:16 GMT`
请求头：

`if-modified-since: Wed, 16 May 2018 05:55:38 GMT`

服务器端返回资源时，如果头部带上了 last-modified，那么资源下次请求时就会把值加入到请求头 if-modified-since中，服务器可以对比这个值，确定资源是否发生变化，如果没有发生变化，则返回 304。

4. etag / if-none-match
这也是一组请求/相应头

响应头：

`etag: "D5FC8B85A045FF720547BC36FC872550"`

请求头：

`if-none-match: "D5FC8B85A045FF720547BC36FC872550"`

原理类似，服务器端返回资源时，如果头部带上了 etag，那么资源下次请求时就会把值加入到请求头 if-none-match 中，服务器可以对比这个值，确定资源是否发生变化，如果没有发生变化，则返回 304。

上面四种缓存的优先级：`cache-control > expires > etag > last-modified`

## Code Splitting
Code Splitting 可以帮你“懒加载”代码，以提高用户的加载体验，如果你没办法直接减少应用的体积，那么不妨尝试把应用从单个 bundle 拆分成单个 bundle + 多份动态代码的形式。

关于代码分割,react 官网有很详细的介绍: https://zh-hans.reactjs.org/docs/code-splitting.html
## LazyLoad

可以直接使用现成的 [react-lazyload](https://github.com/twobin/react-lazyload) 库

React 16.6添加了一个新的特性: React.lazy(), 它可以让代码分割(code splitting)更加容易。

也可以实现像 Medium 的那种加载体验（好像知乎已经是这样了），即先加载一张低像素的模糊图片，然后等真实图片加载完毕之后，再替换掉。

实际上目前几乎所有 lazyload 组件都不外乎以下两种原理：

监听 window 对象或者父级对象的 scroll 事件，触发 load；

使用 Intersection Observer API 来获取元素的可见性。

## 动态加载路由
使用 react-loadable 动态 import React 组件，让首次加载时只加载当前路由匹配的组件。

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable'
import Loading from './components/loading'
 
let Home = Loadable({
  loader: () => import('@/pages/home'),
  loading: Loading
})
let User = Loadable({
  loader: () => import('@/pages/user'),
  loading: Loading
})
let Others = Loadable({
  loader: () => import('@/pages/others'),
  loading: Loading
})
 
export default class RootRouter extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/user" component={User}/>
          <Route path="/others" component={Others}/>
          <Route component={Home}/>
        </Switch>
      </Router>
    )
  }
```


## placeholder
我们在加载文本、图片的时候，经常出现“闪屏”的情况，比如图片或者文字还没有加载完毕，此时页面上对应的位置还是完全空着的，然后加载完毕，内容会突然撑开页面，导致“闪屏”的出现，造成不好的体验。

为了避免这种突然撑开的情况，我们要做的就是提前设置占位元素，也就是 placeholder.

## 分离第三方库
项目开发的时候依赖一些第三方的库，例如React，Lodash，moment等，他们都有提供免费的CDN库。前端构建使用了webpack，打包的时候会将这些依赖的库一起打包，所以第一步是将这些库分离出来。webpack提供了这样的功能
![](https://pic2.zhimg.com/80/v2-e0d04b5772aef06f74e5383bf18109d5_hd.png)


## 加载顺序
先放很经典的一张图![](https://pic2.zhimg.com/80/v2-244a0c3246f534e96ce88124e3978261_hd.jpg)
图中蓝色代表加载 js 代码,红色代表执行 js 代码.
如果首屏只有 HTML 和 css ,可以在 scrip 标签中加 defer. (当然这种情况几乎不会遇到)

不过可以参考以下思路

之前: 加载资源, 运行代码, 请求数据, 渲染界面

之后: 加载资源, 运行代码, 渲染界面, 后台请求数据, 局部更新界面

## 通过webpack的UglifyJsPlugin插件对代码进行压缩
通过简单的UglifyJsPlugin配置可以将代码压缩至原来的一半大小
```
new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
})
```
## 通过webpack实现按需加载
通过与react－router＋webpack配合我们可以实现按需加载，上一段代码：
```jsx
<Route path='/message' getComponent={
  (nextState ,cb) => {
    require.ensure([] , (require) => {
        cb(null,require('./routes/message/index.jsx'));
    },'message');
  }
} />
```
以上是博客demo留言区的路由，再看webpack：
```
output:{
  path: __dirname+'/bundle/',
  publicPath:'/bundle/',
  filename: '[name].bundle.js',
  chunkFilename: '[name].chunk.js'
}
```



此外还有代码压缩,改善代码(例如:只用到了 lodash 中的某个函数,可以自己实现而不引入这个库;编译到 ES2015+;使用更高效的数据结构与算法),通过webpack实现按需加载,通过服务器对代码进行gzip压缩,服务器端渲染首屏

参考链接:

https://zh-hans.reactjs.org/docs/code-splitting.html
https://juejin.im/entry/5b03afd351882542ac7d9291
https://www.jianshu.com/p/a72b1c9d8c32
https://juejin.im/post/5c31a45df265da61193bfc7e