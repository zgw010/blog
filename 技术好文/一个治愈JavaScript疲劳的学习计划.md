## 一个治愈JavaScript疲劳的学习计划 – freeCodeCamp

原文链接： [medium.freecodecamp.org](https://medium.freecodecamp.org/a-study-plan-to-cure-javascript-fatigue-8ad3a54f2eb1)

![img](http://p0.qhimg.com/t010dbe332e62c9de8b.png)

(本文由Sacha Greif于2016年10月30日发表 译者注)

像其他所有人一样, 我最近碰巧也读了 Jose Aguinaga 的文章 “[How it feels to learn JavaScript in 2016](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.5wjpn7svo)”.

很明显那篇文章削弱了人们学习 JavaScript 的勇气，我看见那篇文章不止一次登上了 [Hacker News](http://news.ycombinator.com/) 头条，而是两次。这同时也成为了一篇在 [Reddit 的 JavaScript](http://reddit.com/r/javascript/) 社区很流行的文章，同时在 Medium 也已经超过了10k个赞了，这很可能超过了我写过的文章加起来的点赞数。但谁又在乎呢？

其实那篇文章的出现也不算奇怪，我很早就已经认识到 JavaScript 这个生态是可以使人感到困惑的。事实上, 我做这个关于 [State Of JavaScript](http://stateofjs.com/) 的调查最主要的原因是想要找出哪些库是真正流行的，然后对这些流行的库排个序。

但今天，我想更进一步，不是简单地苦诉现阶段 JavaScript 的一些事情，而是要给你们一个具体的，有步骤的学习计划去征服 JavaScript 这个生态。

### 这篇文章面向谁

这个学习计划是给：

- 如果你已经熟悉了基本的编程概念，像变量和函数。
- 如果你已经能用一些像PHP，Python这样的语言完成后端工作，又或者能用一些前端的库实现一些简单的操作，例如JQuery。
- 如果你想在前端更上一层楼，却又被各种框架和库困扰得不知从何开始。

### 我们会略过的内容

- 一个现代 JavaScript Web app 应该长什么样
- 为什么你不能只使用 JQuery
- 为什么 React 是最安全的选择
- 为什么你可能无需先把 JavaScript 学习得太透彻
- 如何去学习 ES6 语法
- 为什么且如何学习 Redux
- 什么是 GraphQL ？为什么它这么重要？
- 接下来怎么做

### 资源出处声明

免责声明: 这篇文章会引用一些 [Wes Bos](http://wesbos.com/) 在 courses 授课的相关链接，但我更推荐访问原始材料，不仅仅是因为版权问题，而是真的很不错。

如果你想获取更多资源，Mark Erikson 维护着一个关于 [React, ES6, and Redux](https://github.com/markerikson/react-redux-links) 很不错的列表。

### JavaScript vs JavaScript

在我们开始之前，我们要确保我们讨论的是同一件事。如果你 google 搜索“Learn JavaScript”或“JavaScript study plan”，你会发现一大堆结果是教你如何学习 JavaScript 这门语言本身。

但那实际上只是简单的一部分。当你确实可以深入挖掘并学习这门语言的错综复杂部分时，真相是大多数的 web apps 都只是使用相对简单的代码。换句话说，去写 web apps，80%你要用到的知识只是典型 JavaScript 语法书的前几章。

是的, 难的地方其实是操纵 JavaScript 这个伴随着无休止竞争，各种框架和库日新月异的生态系统。好消息是， 那正是这个学习计划所关注的。

### JavaScript Apps 的构造模块

要理解为什么现代 JavaScript apps 看起来这么复杂，你必须首先明白它们是如何工作的。

对于初学者，一起来看看 2008 年左右的“传统” web app：

![img](http://p0.qhimg.com/t01162a9cba9e696589.png)

1. 数据库发送数据给你的后台（例如：你的PHP或Rails app）
2. 后台读取到数据并将数据以HTML格式输出
3. HTML文档被输出到浏览器，进而被构造成一颗 DOM 树（也就是一张网页）

现在很多这些应用程序也在客户端中加入一些JavaScript代码，以增加交互性，如标签页和模式窗口。 但从根本上说，浏览器仍然收到 HTML 并从那里开始解析。

现在将其与一个2016 “现代” web app（也称为“单页面应用程序”）进行比较：

![img](http://p0.qhimg.com/t0115581b8b9e39a031.png)

注意到区别了吗？ 相对于发送HTML，服务器现在发送的是 data，并且在客户端上发生“data到HTML”的转换步骤（这就是为什么还要同时发送代码告诉客户端如何执行所述的转换操作）。

这里有很多含义。 首先，说说它的好处：

- 对于给定的内容，只发送 data 比发送整个 HTML 页面更快。
- 客户端可以立即交换内容，而无需刷新浏览器窗口（因此称为“单页面应用”）。

坏处是：

- 初次加载时间较长，因为“data到HTML”代码库可能会增长得很大。
- 万一您想要缓存或检视程序，您现在也需要在客户端有一个存储和管理数据的地方。

不上不下的地方却是:

- 恭喜 - 您现在必须应付一个可以像服务器端技术栈一样复杂的客户端技术栈。

### 客户端与服务器之间

如果有这么多的缺点，那么为什么还要搞那么麻烦？ 为什么不坚持老旧的 PHP 应用程序呢？

假设你在构建一个计算器，如果用户想知道2+2等于多少，当浏览器有足够能力去计算时，却把这个计算过程提交给服务器的话，这是意义不大的。

另一方面，如果您正在构建一个纯静态网站（如博客）， 在服务器生成最终的 HTML 是完全没问题的。

真相是，大多数的 web apps 都裁倒在了服务器与客户端中间，问题是要知道裁在哪儿。

但关键的一件事是服务器与客户端之间不是连绵不断的，你不能从一个纯粹的服务端应用开始，将它慢慢转变成客户端应用。在某个点（临界点）上，你会被迫中止并且重构一切，或是最终裁在难以维护的意大利面条式的代码下。

![img](http://p0.qhimg.com/t018a705ebc94a972a2.png)

这正是为什么你不应“只使用 JQuery”。你可以设想 jQuery 像胶带，对于房子周围的小修复来说，这是非常方便的，但是如果你不断贴越来越多的胶带却会使房子看起来很丑陋。

另一方面，现代 JavaScript 框架更像是3D打印的替代品：它需要更多的时间，但结果是更洁净和更坚固。

另外，要想掌握当下的 JavaScript 技术栈，无论从哪里开始，都像是一场赌注。大多数的 web apps 可能迟早会裁在客户端那边。所以现在我们要做更多的工作，但这其实也算是一件好事。

### 第0周：JavaScript基础知识

除非你是一个纯粹的后端开发人员，否则你可能知道一些 JavaScript 。 即使没有，如果你是 PHP 或 Java 开发人员，JavaScript 那种类似 C 语言的语法也将会变得很熟悉才对。

但如果JavaScript对你来说是一个完全陌生的概念，不要沮丧。 有很多免费的资源可以帮助你快速起步。 例如，[Codecademy 的 JavaScript 课程](https://www.codecademy.com/learn/javascript)就是一个适合新手上路的好地方。

### 第1周：从 React 开始

相信你现在知道了基础的 JavaScript 语法，并且明白了为什么 JavaScript apps 可以这么复杂，让我们说得细点，你应该从哪儿开始呢？

我的答案是 [React](https://facebook.github.io/react/).

[![img](http://p0.qhimg.com/t014e7f658d1c4714dd.png)](https://facebook.github.io/react/)

React是一个由Facebook创建并开源的 UI 库，它所做的就是“data到HTML”（视图层）的那一步。

现在可别误会我，我不是要告诉你选择 React 是因为它是最好的框架（因为那太主观了），但 React 确实也挺不错的。

- React 可能不是最流行的框架，但也挺流行的。
- React 可能不是最轻量级的框架，但也挺轻量级的。
- React 可能不是最容易学的，但也挺容易学的。
- React 可能不是最优雅的框架，但也挺优雅的。

总之，在各种的情形下 React 也许不是最好的选择，但我认为它是最安全的。相信我，当你开始学习新技术的时候去冒太大的险总不是什么好事。

React 会让你认识到一些像组件、应用程序状态、无状态的函数式组件等概念，这些概念对你以后都会有所帮助，即使你以后是在使用其他的框架或库。

最后，React 还有一个各种包和库都非常健壮的庞大生态， 它的流行度意味着您可以在 Stack Overflow 等网站上找到很多帮助。

我个人推荐 Wes Bos 的 [React for Beginners](https://reactforbeginners.com/friend/STATEOFJS) 课程。这是我当初学习React的途径，这门课程完整地包含了最新的 React 实践。

### 你应该先把 JavaScript 学得很透彻吗？

如果你是一个非常有条理的学习者，你可能希望在做任何事情之前，很好地掌握JavaScript的基础知识。

但对于其他人来说，这就像通过学习人体解剖学和流体动力学那样去学习游泳。 当然，他们都在游泳中扮演了重要的角色，但是跳进游泳池更有趣！

这里没有正确或错误的答案，这一切都取决于你的学习风格。 事实是，大多数基本的 React 教程可能只会使用 JavaScript 的一小部分，所以只关注现在所需要的，并将其余部分放在后面是非常好的。

这种方式同时也适用于学习 JavaScript 这个大生态，现在不要太过担心不懂像 Webpack 或 Babel 的这些技术，事实上 React 最近也提出了自己的 [command-line utility](https://github.com/facebookincubator/create-react-app) 能让你不用配置一大堆东西去构建应用。

### 第2周：你的第一个 React 项目

假设你刚完成了 React 的课程，如果你跟我一样的话，下面两件事准没错：

- 你已经快把你刚学的知识忘掉一半了
- 你迫不及待地想用实践的方法去记住还没忘掉的另一半

我认为学习一个框架或一门语言的最佳方式就是使用它，并且个人项目是尝试新技术的最佳方式。

一个个人项目可以是一个单页应用到复杂的 web app之间的任意项目，但我认为重新设计你的个人网站会是一个不错的折中选择。另外，我认为你可能已经把这个计划拖延了好久了！

我之前确实说过使用单页应用去进行静态内容的开发是大材小用，但 React 有个秘密武器： [Gatsby](https://github.com/gatsbyjs/gatsby)，一个能让你“欺骗”并且利用 React 所有好处的静态站点生成器，而且没有任何缺点。

![img](http://p0.qhimg.com/t01f2cb21a46f50de16.gif)

以下是用 Gatsby 作为开始学习 React 的好处：

- 一个已经预配置好的 Webpack ，说明你可以放心地做个伸手党。
- 基于你的目录结构自动路由。
- 所有的 HTML 也是在服务端生成，所以你在前后端都能受益。
- 静态内容意味着不提供服务或是简单地挂在 [GitHub Pages](https://pages.github.com/)。

我曾用 Gatsby 构建过 [State Of JavaScript](http://stateofjs.com/) 这个站点，并且都不用去操心路由、构建工具的配置或是服务端的渲染，这些都为我节省了大量时间。

### 第3周：掌握 ES6

在我探索 React 的路上，我很快就能通过复制粘贴理解到一些要点，但却总有很多我不明白的地方。

具体地说，我当时不是很熟悉 [ES6](http://es6-features.org/#Constants) 的一些新特性，例如：

- 箭头函数
- 对象解构
- 类
- 扩展运算符

如果你跟我一样，现在可能也是时候花上一段时间去好好学学 ES6 了。如果你享受 [React for Beginners](https://reactforbeginners.com/friend/STATEOFJS) 课程，你可以再看看 Wes 讲的关于 ES6 的视频 [ES6 for Everybody](https://es6.io/friend/stateofjs) 。

又或者你更偏爱免费资源，可以看看 [Nicolas Bevacqua 的书：Practical ES6](https://ponyfoo.com/books/practical-es6/chapters)。

一个掌握 ES6 的好方法是回顾你之前写过的代码（像第2周写的代码），然后尽可能地转换成 ES6 ，不断地去精炼它。

### 第4周：着手状态管理

现在你应该有能力用一些静态内容去构建一个简单的 React 项目了。

但真正的 web apps 却不是静态的：它们需要从某些地方获取它们的数据，一般是数据库或其他某些地方。

现在你可以直接发送数据到你的独立组件，但那很快会变得凌乱。举个例子，万一两个组件需要显示同一份数据？或是两个组件需要互相通信？

这时正是 **状态管理** 出现的时候了。相对于在每个组件逐位逐位地存储你的状态（换句话说，就是你的数据），你可以存到一个 **全局仓库**，然后再调度到每一个 React 组件上：

![img](http://p0.qhimg.com/t010405c331daab21fc.png)

在 React 的世界里，最流行的状态管理库是 Redux。 Redux 不仅能汇聚你的数据，同时也能对操作数据强制执行一些准则。

[![img](http://p0.qhimg.com/t016d5b5bc92c0c9ec5.png)](http://redux.js.org/)

假设 Redux 是一间银行：你不能去你的本地分行然后直接手动修改你的存款余额（“来，我可以给你在后面加上几个零”）。相反，你必须填一张存款表格，然后给出纳员请求允许操作。

类似地，Redux 也不会让你直接修改全局状态。相反，你传递操作给“reducers” ——实现操作并返回更新状态的特殊函数。

这些额外操作的结果，在你的整个 app 中是一个高标准化的和可维护的数据流，你可以通过 [Redux Devtools](https://github.com/gaearon/redux-devtools) 生动形象的展示出来。

![img](http://p0.qhimg.com/t011cb79877c6b64d76.gif)

再提一下，你还是可以跟 Wes 一起学习[他的 Redux 课程](https://learnredux.com/)，都是免费的！

或者，你可以看 Redux 作者 Dan Abramov [在 egghead.io 的视频](https://egghead.io/courses/getting-started-with-redux)，也是免费的！

### 丰收的第5周: 使用GraphQL构建API

目前为止，我们都只是讨论了客户端，那才说了一半呢。即使我们没有踏进整个 Node 的生态，但处理任何一个 web app 都很重要的一点就是：数据是如何从服务端到客户端的。

这点也不会有什么惊喜，因为这一切改变得太快了，随着 [GraphQL](http://graphql.org/)（Facebook 的另一个开源项目）的出现，它完全可以替代传统的 REST APIs。

[![img](http://p0.qhimg.com/t01a878191324f47ace.png)](http://graphql.org/)

然而 REST API 公开了多个REST路由，每个 REST 路由都可以访问预定义的数据集（例如 /api/posts，/api/comments 等），GraphQL 公开了一个端点，可以让客户端查询所需的数据。

假想一个人要分别跑到肉店、面包店和杂货店买三样东西，与给这个人一张购物清单然后把这三样东西一并送到他家中相比。

当你需要查询多个数据源时，这种新策略显得特别有意义。就像买东西的那样，你可以用一个请求就把所有的资源一次性给取回来。

GraphQL 已经在过去的一年或更久得到了很快的发展，已经有很多的项目（例如 [Gatsby](https://github.com/gatsbyjs/gatsby/)，我们在第2周用到的）计划着要去使用它了。

GraphQL 本身只是一个协议，但它现在最出色的实现是在 [Apollo](http://apollostack.com/) 库，一个与 Redux 兼容地很好的库。现在关于 GraphQL 和 Apollo 的教程都相对较少，希望 [Apollo 的官方文档](http://dev.apollodata.com/)能帮助你开始学习。

### React & Co 之外

我建议您从 React 开始，因为它是一个安全的选择，但绝不是唯一有效的前端技术栈。 如果你想继续探索，这里有两个推荐：

#### Vue

[Vue](http://vuejs.org/) 是一个相对较新的框架，却以惊人的速度成长。Vue 已经被很多大公司接受使用了，例如百度和阿里巴巴。PHP 框架 [Laravel](https://laravel.com/) 默认也包含了基本的 Vue ，用以提供开发者快速编写 JavaScript 应用。

[![img](http://p0.qhimg.com/t01efe034c9fca4ec49.png)](http://vuejs.org/)

跟 React 相比，Vue 有这些亮点：

- 官方维护的路由和状态管理库
- 注重性能
- 使用基于 HTML 的模板，降低学习曲线
- 较少的模板代码

按照实际情况来说，依靠 React 和 [React Native](https://facebook.github.io/react-native/)（以后会详细介绍）的庞大社区，前面两点依然能让 React 和 [React Native](https://facebook.github.io/react-native/) 稍微地比 Vue 好点，但我也不会因为 Vue 很快追上 React 而表示惊讶！

#### Elm

如果 Vue 是一个十分平易近人的框架，则 [Elm](http://elm-lang.org/) 是一个很前沿的框架。Elm 不仅是一个框架，而是一种能编译成 JavaScript 的全新语言。

这个框架有很多优点，例如性能的提升，强制的版本控制并且没有运行时异常。

我还没用过 Elm，但已经被朋友们热情地推荐过了，并且 Elm 社区的用户们也表示对这个框架很满意（根据在2016 JavaScript 现状调查有 [84%的满意度](http://stateofjs.com/2016/flavors/)）。

### 下一步

到目前为止，您应该很好地掌握了整个 React 的前端技术栈，希望你可以有效地将它带到生产中。

但这并不意味着就完了! 这只是您进入 JavaScript 大生态的一个开始.。这里有些你可能日后会遇到的主题，希望对你有所帮助：

- 在服务器的 JavaScript (Node, [Express](https://expressjs.com/)…)
- JavaScript 测试 ([Jest](https://facebook.github.io/jest/), [Enzyme](https://github.com/airbnb/enzyme)…)
- 构建工具 ([Webpack](https://webpack.github.io/)…)
- 类型系统 ([TypeScript](https://www.typescriptlang.org/), [Flow](https://flowtype.org/)…)
- 在你的 JavaScript 应用中处理 CSS ([CSS Modules](https://github.com/css-modules/css-modules), [Styled Components](https://github.com/styled-components/styled-components)…)
- 适用于移动应用的 JavaScript ([React Native](https://facebook.github.io/react-native/)…)
- 适用于桌面应用的 JavaScript ([Electron](http://electron.atom.io/)…)

我不会在这列举所有的出来，但别灰心！万事开头难，再说，你已经完成了这个学习计划了。

现在你对前端的各个部分是怎样结合起来的有了一定了解，这时的问题只是思考接下来要学习什么并且每个月都要对新技术下点功夫。

 