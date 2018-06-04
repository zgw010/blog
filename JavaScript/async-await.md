以下定义相同

```javascript
function f() {
    return Promise.resolve('TEST');
}

// asyncF is equivalent to f!
async function asyncF() {
    return 'TEST';
}
```

![](../imgs/concurrent_vs_parallel.png)

promise是用来解决两个问题的：

- 回调地狱，代码难以维护， 常常第一个的函数的输出是第二个函数的输入这种现象
- promise可以支持多个并发的请求，获取并发请求中的数据
- 这个promise可以解决异步的问题，本身不能说promise是异步的

