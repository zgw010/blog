## 编写有弹性的组件

有一些组件设计原则非常有用：

1. 不阻断数据流

直接读取 props，避免复制 props(或从 props 中计算得到的值) 到 state：

好的做法:

```js
function Button({ color, children }) {
  return (
    // ✅ `color` 永远是新的!
    <button className={'Button-' + color}>
      {children}
    </button>
  );
}
```

不好的做法:

```js
class Button extends React.Component {
  state = {
    color: this.props.color
  };
  render() {
    const { color } = this.state; // 🔴 `color` 不新鲜了！
    return (
      <button className={'Button-' + color}>
        {this.props.children}
      </button>
    );
  }
}
```

如果涉及到比较昂贵的计算, Hooks 有更好的解决方案

```js
function Button({ color, children }) {
  const textColor = useMemo(
    () => slowlyCalculateTextColor(color),
    [color] // ✅ 除非 `color` 改变，不会重新计算
  );
  return (
    <button className={'Button-' + color + ' Button-text-' + textColor}>
      {children}
    </button>
  );
}
```

优化昂贵的计算也不是将 props 复制到 state 的好理由。我们的渲染结果应该响应 props 的变化。

不要在 Side Effects 里阻断数据流

好的做法

```js
class SearchResults extends React.Component {
  state = {
    data: null
  };
  componentDidMount() {
    this.fetchResults();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) { // ✅ 重新获取数据
      this.fetchResults();
    }
  }
  fetchResults() {
    const url = this.getFetchUrl();
    // 获取数据...
  }
  getFetchUrl() {
    return 'http://myapi/results?query' + this.props.query; // ✅ 更新也处理好了
  }
  render() {
    // ...
  }
}
```

但是当有多个需要检测是否变动的 props 时, 很有可能我们在 componentDidUpdate 中会漏掉一些判断, 如果我们可以利用一些 linter 来帮助我们检测是个很好的办法, 但是可惜的是, 自动检查类组件的一致性太困难了.

但是 Hooks 可以完美的解决这个问题

```js
function SearchResults({ query }) {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    function fetchResults() {
      const url = getFetchUrl();
      // 数据获取...
    }

    function getFetchUrl() {
      return (
        'http://myapi/results?query' + query +
        '&page=' + currentPage
      );
    }

    fetchResults();
  }, [currentPage, query]); // ✅ 更新后重新获取

  // ...
}
```

总之我们的原则是: 无论是将组件编写为类还是函数，都必须为 effect 响应所有 props 和 state 的更新。


2. 时刻准备渲染

你的组件应该随时可以重新渲染。

组件应该具有弹性，能适应更少或更频繁地渲染，否则它们与特定父组件存在过多耦合。

当你真正想从 props 派生 state 时，尽管有一些不同的解决方案，通常你应该使用一个完全受控制的组件：

```js
// Option 1: Fully controlled component.
function TextInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

或者使用一个不受控的组件，加上 key 来重置它：

```js
// Option 2: Fully uncontrolled component.
function TextInput() {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

// 之后我们能通过更改 key 来重置内部 state：
<TextInput key={formId} />
```

如果可以的话，避免派生 state。当然，时刻准备渲染！

3. 没有单例组件

有时我们假设某个组件只会显示一次，如导航栏。在一段时间内这也许是对的，然而，这种假设导致的设计问题，常常会在后期显现。

假设下面的场景
```js
ReactDOM.render(
  <>
    <MyApp />
    <MyApp />
  </>,
  document.getElementById('root')
);

componentWillUnmount() {
  // 重置 Redux store 里的一些东西
  this.props.resetForm();
}
```

如果页面上有两个这样的组件，卸载其中一个组件可能会破坏另一个组件。

显示 或 隐藏 一颗树，不应该破坏树之外的组件。

4. 隔离本地状态

React 组件可能有本地状态。但是哪个状态真的是自己的呢？帖子内容本身是否为本地状态？评论列表呢？或者评论流的记录？或评论框里输入的值？

如果你不确定某个状态是否属于本地，请问自己：“如果此组件呈现两次，交互是否应反映在另一个副本中？” 只要答案为“否”，那你就找到本地状态了。

即使你不使用 React，对于存在单向数据流的任何 UI 组件模型，可能也能通过反复试验发现相同的原则。


## 引用
- [编写有弹性的组件 by Dan Abramov](https://overreacted.io/zh-hans/writing-resilient-components/#%E7%BC%96%E5%86%99%E6%9C%89%E5%BC%B9%E6%80%A7%E7%9A%84%E7%BB%84%E4%BB%B6)