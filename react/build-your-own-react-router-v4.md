# 构造自己的 react-router4

## 简单hash router实现
```js
class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
  }

  // routes 用来存放不同路由对应的回调函数
  route(path, callback) {
    this.routes[path] = callback || function() {};
  }

  updateView() {
    this.currentUrl = location.hash.slice(1) || '/';
    // 如果存在该路径，则执行该路径对应的回调函数
    this.routes[this.currentUrl] && this.routes[this.currentUrl]();
    // 对应下面的html文件的routes如下
    // {
    //   '/': () => {
    //     document.getElementById('content').innerHTML = 'Home';
    //   },
    //   '/about': () => {
    //     document.getElementById('content').innerHTML = 'About';
    //   },
    //   '/topics': () => {
    //     document.getElementById('content').innerHTML = 'Topics';
    //   }
    // }
  }

  // init 用来初始化路由，在 load 事件发生后刷新页面，
  // 并且绑定 hashchange 事件，当 hash 值改变时触发对应回调函数
  init() {
    window.addEventListener('load', this.updateView.bind(this), false);
    window.addEventListener('hashchange', this.updateView.bind(this), false);
  }
}
```
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <div id="app">
    <ul>
      <li>
        <a href="#/">home</a>
      </li>
      <li>
        <a href="#/about">about</a>
      </li>
      <li>
        <a href="#/topics">topics</a>
      </li>
    </ul>
    <div id="content"></div>
  </div>
  <script src="./Router.js"></script>
  <script>
    const router = new Router();
    router.init();
    router.route('/', function () {
      document.getElementById('content').innerHTML = 'Home';
    });
    router.route('/about', function () {
      document.getElementById('content').innerHTML = 'About';
    });
    router.route('/topics', function () {
      document.getElementById('content').innerHTML = 'Topics';
    });
  </script>
</body>

</html>
```

## 简单 history 路由实现
hash 的改变可以触发 onhashchange 事件，而 history 的改变并不会触发任何事件，这让我们无法直接去监听 history 的改变从而做出相应的改变。

换个思路
罗列出所有可能触发 history 改变的情况，并且将这些方式一一进行拦截，变相地监听 history 的改变

对于一个应用而言，url 的改变(不包括 hash 值得改变)只能由下面三种情况引起：

点击浏览器的前进或后退按钮 => 可以监听onpopstate事件
点击 a 标签
在 JS 代码中触发 history.push(replace)State 函数
history路由跟上面的hash类似，区别在于 init 初始化函数，首先需要获取所有特殊的链接标签，然后监听点击事件，并阻止其默认事件，触发 history.pushState 以及更新相应的视图

```js
init() {
  // 该函数对a标签进行监听，并阻止默认事件，触发更新
  this.bindLink();
  window.addEventListener('popstate', e => {
    this.updateView(window.location.pathname);
  });
  window.addEventListener('load', () => this.updateView('/'), false);
}
bindLink() {
  const allLink = document.querySelectorAll('a[data-href]');
  for (let i = 0, len = allLink.length; i < len; i++) {
    const current = allLink[i];
    current.addEventListener(
      'click',
      e => {
        e.preventDefault();
        const url = current.getAttribute('data-href');
        history.pushState({}, null, url);
        this.updateView(url);
      },
      false
    );
  }
}
```
## 实现 <Router>

下面是官网的一个例子
```jsx
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

export default BasicExample;
```

```js
class Route extends Component {
  static propTypes = {
    exact: PropTypes.bool,
    path: PropTypes.string,
    component: PropTypes.func, // 组件返回UI  所以是func
    render: PropTypes.func,
  }

  render() {
    const { path, exact, component, render } = this.props;
    // window.location是全局变量，location可以直接拿到
    const match = matchPath(location.pathname, { path, exact });
    // 如果没有匹配上 path 属性，return null
    if(!match) return null;
    // 匹配上path属性，并且有component属性 直接创建新元素， 通过match传递过去
    if (component) return React.createElement(component, { match });
    // 匹配上path属性，没有component属性，检查render属性
    if (render) return render({ match });
    // 全都没有匹配上，只好null了
    return null;
  }
}
```






















> https://tylermcginnis.com/build-your-own-react-router-v4/
https://github.com/amandakelake/blog/issues/53
