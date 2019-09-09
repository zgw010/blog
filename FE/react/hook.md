# HOOKS
## Introducing Hooks
### Motivation
因为 class component 有以下缺点,所以出现了 Hooks 
- It’s hard to reuse stateful logic between components
- Complex components become hard to understand
- Classes confuse both people and machines

Hooks 是 backwards-compatible (向后兼容)的, 官方并不准备废除 class component 的写法, 而是准备让两者并存
Hooks let you use more of React’s features without classes.
## Hooks at a Glance
### But what is a Hook?
Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes.
### 简单例子 State Hook
```js
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
### 简单例子 Effect Hook
useEffect - It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.
```js
// 1
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
```js
// 2
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // 这里的 return ,相当于 componentWillUnmount
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```
### Rules
- Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
- Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions. (There is just one other valid place to call Hooks — your own custom Hooks. We’ll learn about them in a moment.)
Hooks are a way to reuse stateful logic, not state itself. 

## Using the State Hook
先比较下两种写法
```js
// class
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}

// Hooks
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
### 
What is a Hook? A Hook is a special function that lets you “hook into” React features. For example, useState is a Hook that lets you add React state to function components. We’ll learn other Hooks later.

### When would I use a Hook? 
If you write a function component and realize you need to add some state to it, previously you had to convert it to a class. Now you can use a Hook inside the existing function component. We’re going to do that right now!
## Using the Effect Hook
```js
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
you can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined.
```js
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // 同时上面的这部分也默认只会在组件加载时运行, 而不会在组件更新时运行, 即 componentDidMount 时运行, 而 componentDidUpdate 时不运行
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

关于 componentDidUpdate
```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
// 这个要求很常见，它内置于useEffectHook API中。如果重新渲染之间某些值没有改变，您可以告诉React 跳过应用效果。为此，将数组作为可选的第二个参数传递给useEffect：

useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
```
## Rules of Hooks
### Only Call Hooks at the Top Level
### Only Call Hooks from React Functions
Hooks 依赖调用 Hooks 的顺序来标识它们, 如果放在回调里或者判断语句里会出现执行顺序不一定的情况
## Building Your Own Hooks
custom Hook 就是下面这种格式的函数
```js
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```
*but every time you use a custom Hook, all state and effects inside of it are fully isolated.*
### How does a custom Hook get isolated state? 
Each call to a Hook gets isolated state. Because we call useFriendStatus directly, from React’s point of view our component just calls useState and useEffect. And as we learned earlier, we can call useState and useEffect many times in one component, and they will be completely independent.
还是因为上面说到的按顺序标记,所以能独立开? 以及 from React’s point of view our component just calls useState and useEffect .
### Pass Information Between Hooks
```js
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```
## Hooks API Reference

## Hooks FAQ
生命周期方法如何与Hooks相对应？
- constructor：函数组件不需要构造函数。您可以初始化useState呼叫中的状态。如果计算它很昂贵，你可以传递一个函数useState。

- getDerivedStateFromProps：改为在渲染时安排更新。

- shouldComponentUpdate：见React.memo 下文。

- render：这是功能组件主体本身。

- componentDidMount，componentDidUpdate，componentWillUnmount：所述的useEffect挂钩可表达的这些的所有组合（包括以下 共同例）。

- componentDidCatch并且getDerivedStateFromError：这些方法还没有Hook等价物，但很快就会添加它们。