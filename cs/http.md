# HTTP 缓存
缓存是一种保存资源副本并在下次请求时直接使用该副本的技术。当 web 缓存发现请求的资源已经被存储，它会拦截请求，返回该资源的拷贝，而不会去源服务器重新下载。

缓存可以分为私有和共享缓存, 私有缓存只能用于单独用户。共享缓存可以被多个用户使用。

HTTP 协议头中的字段，都属于 disk cache 的范畴，是几个缓存位置的其中之一。

## [补充的缓存知识](https://zhuanlan.zhihu.com/p/44789005)
浏览器在命中缓存的时候会按照下面的顺序由上到下寻找，找到即返回；找不到则继续

- Service Worker
- Memory Cache
- Disk Cache
- 网络请求
****
memory cache

memory cache 是内存中的缓存，(与之相对 disk cache 就是硬盘上的缓存)。按照操作系统的常理：先读内存，再读硬盘。disk cache 将在后面介绍 (因为它的优先级更低一些)，这里先讨论 memory cache。

几乎所有的网络请求资源都会被浏览器自动加入到 memory cache 中。但是也正因为数量很大但是浏览器占用的内存不能无限扩大这样两个因素，memory cache 注定只能是个“短期存储”。常规情况下，浏览器的 TAB 关闭后该次浏览的 memory cache 便告失效 (为了给其他 TAB 腾出位置)。而如果极端情况下 (例如一个页面的缓存就占用了超级多的内存)，那可能在 TAB 没关闭之前，排在前面的缓存就已经失效了。
## HTTP 1.0

Expires 响应头包含日期/时间， 即在此时候之后，响应过期。
 
无效的日期，比如 0, 代表着过去的日期，即该资源已经过期。

如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。

## 缓存控制
HTTP/1.1定义的 Cache-Control 头用来区分对缓存机制的支持情况， 请求头和响应头都支持这个属性。通过它提供的不同的值来定义缓存策略。
缓存请求指令, 客户端可以在HTTP请求中使用的标准 Cache-Control 指令。
```http
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-control: no-cache
// Pragma 是HTTP/1.0标准中定义的一个header属性，请求中包含Pragma的效果跟在头信息中定义Cache-Control: no-cache相同，但是HTTP的响应头不支持这个属性，所以它不能拿来完全替代HTTP/1.1中定义的Cache-control头。通常定义Pragma以向后兼容基于HTTP/1.0的客户端。
Cache-control: no-store
Cache-control: no-transform
Cache-control: only-if-cached
```
缓存响应指令节, 服务器可以在响应中使用的标准 Cache-Control 指令。
```http
Cache-control: must-revalidate
Cache-control: no-cache // 每次有请求发出时，缓存会将此请求发到服务器（译者注：该请求应该会带有与本地缓存相关的验证字段），服务器端会验证请求中所描述的缓存是否过期，若未过期（注：实际就是返回304），则缓存才使用本地缓存副本。
Cache-control: no-store // 缓存中不得存储任何关于客户端请求和服务端响应的内容。每次由客户端发起的请求都会下载完整的响应内容。
Cache-control: no-transform
Cache-control: public // 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容（例如，该响应没有max-age指令或Expires消息头）。
Cache-control: private // 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容。
Cache-control: proxy-revalidate
Cache-Control: max-age=<seconds> // 过期机制中，最重要的指令是 "max-age=<seconds>"，表示资源能够被缓存（保持新鲜）的最大时间。相对Expires而言，max-age是距离请求发起的时间的秒数。针对应用中那些不会改变的文件，通常可以手动设置一定的时长以保证缓存有效，例如图片、css、js等静态资源。
Cache-control: s-maxage=<seconds> // 覆盖max-age或者Expires头，但是仅适用于共享缓存(比如各个代理)，私有缓存会忽略它。
```
扩展Cache-Control指令节, 拓展缓存指令不是核心HTTP缓存标准文档的一部分，使用前请注意检查兼容性！
```http
Cache-control: immutable 
Cache-control: stale-while-revalidate=<seconds>
Cache-control: stale-if-error=<seconds>
```

## 新鲜度
理论上来讲，当一个资源被缓存存储后，该资源应该可以被永久存储在缓存中。由于缓存只有有限的空间用于存储资源副本，所以缓存会定期地将一些副本删除，这个过程叫做缓存驱逐。

另一方面，当服务器上面的资源进行了更新，那么缓存中的对应资源也应该被更新，由于HTTP是C/S模式的协议，服务器更新一个资源时，不可能直接通知客户端更新缓存，所以双方必须为该资源约定一个过期时间，在该过期时间之前，该资源（缓存副本）就是新鲜的，当过了过期时间后，该资源（缓存副本）则变为陈旧的。

驱逐算法用于将陈旧的资源（缓存副本）替换为新鲜的，注意，一个陈旧的资源（缓存副本）是不会直接被清除或忽略的，当客户端发起一个请求时，缓存检索到已有一个对应的陈旧资源（缓存副本），则缓存会先将此请求附加一个If-None-Match头，然后发给目标服务器，以此来检查该资源副本是否是依然还是算新鲜的，若服务器返回了 304 (Not Modified)（该响应不会有带有实体信息），则表示此资源副本是新鲜的，这样一来，可以节省一些带宽。若服务器通过 If-None-Match 或 If-Modified-Since判断后发现已过期，那么会带有该资源的实体内容返回。

## 缓存验证
用户点击刷新按钮时会开始缓存验证。如果缓存的响应头信息里含有"Cache-control: must-revalidate”的定义，在浏览的过程中也会触发缓存验证。另外，在浏览器偏好设置里设置Advanced->Cache为强制验证缓存也能达到相同的效果。

当缓存的文档过期后，需要进行缓存验证或者重新获取资源。只有在服务器返回强校验器或者弱校验器时才会进行验证。

### ETags
作为缓存的一种强校验器，ETag 响应头是一个对用户代理(User Agent, 下面简称UA)不透明（译者注：UA 无需理解，只需要按规定使用即可）的值。对于像浏览器这样的HTTP UA，不知道ETag代表什么，不能预测它的值是多少。如果资源请求的响应头里含有ETag, 客户端可以在后续的请求的头中带上 If-None-Match 头来验证缓存。

Last-Modified 响应头可以作为一种弱校验器。说它弱是因为它只能精确到一秒。如果响应头里含有这个信息，客户端可以在后续的请求中带上 If-Modified-Since 来验证缓存。

当向服务端发起缓存校验的请求时，服务端会返回 200 ok表示返回正常的结果或者 304 Not Modified(不返回body)表示浏览器可以使用本地缓存文件。304的响应头也可以同时更新缓存文档的过期时间。

## 带 [Vary](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Vary) 头的响应

语法
```http
Vary: *
Vary: <header-name>, <header-name>, ...
```

`*`

所有的请求都被视为唯一并且非缓存的，使用Cache-Control: private,来实现则更适用，这样用于说明不存储该对象更加清晰。

`<header-name>`

逗号分隔的一系列http头部名称，用于确定缓存是否可用。


Vary HTTP 响应头决定了对于后续的请求头，如何判断是请求一个新的资源还是使用缓存的文件。

当缓存服务器收到一个请求，只有当前的请求和原始（缓存）的请求头跟缓存的响应头里的Vary都匹配，才能使用缓存的响应。

# [HTTP 响应码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
100 Continue:
这个临时响应表明，迄今为止的所有内容都是可行的，客户端应该继续请求，如果已经完成，则忽略它。

101 Switching Protocol:
该代码是响应客户端的 Upgrade 标头发送的，并且指示服务器也正在切换的协议。

200 OK:
请求成功。成功的含义取决于HTTP方法：

- GET：资源已被提取并在消息正文中传输。
- HEAD：实体标头位于消息正文中。
- POST：描述动作结果的资源在消息体中传输。
- TRACE：消息正文包含服务器收到的请求消息

301 Moved Permanently:
被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个 URI 之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。

302 Found:
请求的资源现在临时从不同的 URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。

304 Not Modified:
如果客户端发送了一个带条件的 GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304 响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。

403 Forbidden:
服务器已经理解请求，但是拒绝执行它。与 401 响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个 HEAD 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个 404 响应，假如它不希望让客户端获得任何信息。

404 Not Found:
请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下。

500 Internal Server Error:
服务器遇到了不知道如何处理的情况。

501 Not Implemented:
此请求方法不被服务器支持且无法被处理。只有GET和HEAD是要求服务器支持的，它们必定不会返回此错误代码。

502 Bad Gateway:
此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。

503 Service Unavailable:
服务器没有准备好处理请求。 常见原因是服务器因维护或重载而停机。 请注意，与此响应一起，应发送解释问题的用户友好页面。 这个响应应该用于临时条件和 Retry-After：如果可能的话，HTTP头应该包含恢复服务之前的估计时间。 网站管理员还必须注意与此响应一起发送的与缓存相关的标头，因为这些临时条件响应通常不应被缓存。

504 Gateway Timeout:
当服务器作为网关，不能及时得到响应时返回此错误代码。

505 HTTP Version Not Supported:
服务器不支持请求中所使用的HTTP协议版本。

# HTTPS

直接补上两个链接

[图解SSL/TLS协议](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)

[SSL/TLS协议运行机制的概述](https://www.ruanyifeng.com/blog/2014/02/ssl_tls.html)