React 自己实现了一套高效的事件注册、存储、分发和重用的逻辑，在 DOM 事件体系基础上做了很大改进。不仅减少了内存消耗，最大化解决了 IE 等浏览器的不兼容问题，而且简化了事件逻辑，对开发者来说非常友好。

它有如下的特点:

- 使用事件委托技术进行事件代理，React 组件上声明的事件最终都转化为 DOM 原生事件，绑定到了 document 这个 DOM 节点上。从而减少了内存开销。
- 自身实现了一套事件冒泡机制，以队列形式，从触发事件的组件向父组件回溯，调用在 JSX 中绑定的 callback。因此我们也没法用 event.stopPropagation() 来停止事件传播，应该使用 React 定义的 event.preventDefault()。
- React 有一套自己的合成事件 SyntheticEvent，而不是单纯的使用 DOM 原生事件，但二者可以平滑转化。
- React 使用对象池来管理合成事件对象的创建和销毁，这样减少了垃圾的生成和新对象内存的分配，大大提高了性能。

## React 事件的实现

### React 事件系统流程

Summary of `ReactBrowserEventEmitter` event handling:

 - Top-level delegation is used to trap most native browser events. This
   may only occur in the main thread and is the responsibility of
   ReactDOMEventListener, which is injected and can therefore support
   pluggable event sources. This is the only work that occurs in the main
   thread.

 - We normalize and de-duplicate events to account for browser quirks. This
   may be done in the worker thread.

 - Forward these native events (with the associated top-level type used to
   trap it) to `EventPluginHub`, which in turn will ask plugins if they want
   to extract any synthetic events.

 - The `EventPluginHub` will then process each event by annotating them with
   "dispatches", a sequence of listeners and IDs that care about that event.

 - The `EventPluginHub` then dispatches the events.

Overview of React and the event system:

+------------+    .
|    DOM     |    .
+------------+    .
      |           .
      v           .
+------------+    .
| ReactEvent |    .
|  Listener  |    .
+------------+    .                         +-----------+
      |           .               +--------+|SimpleEvent|
      |           .               |         |Plugin     |
+-----|------+    .               v         +-----------+
|     |      |    .    +--------------+                    +------------+
|     +-----------.--->|EventPluginHub|                    |    Event   |
|            |    .    |              |     +-----------+  | Propagators|
| ReactEvent |    .    |              |     |TapEvent   |  |------------|
|  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
|            |    .    |              |     +-----------+  |  utilities |
|     +-----------.--->|              |                    +------------+
|     |      |    .    +--------------+
+-----|------+    .                ^        +-----------+
      |           .                |        |Enter/Leave|
      +           .                +-------+|Plugin     |
+-------------+   .                         +-----------+
| application |   .
|-------------|   .
|             |   .
|             |   .
+-------------+   .
                  .
   React Core     .  General Purpose Event Plugin System

浏览器事件（如用户点击了某个button）触发后，DOM(dcoument)将event传给ReactEventListener，它将事件分发到当前组件及以上的父组件。然后由ReactEventEmitter对每个组件进行事件的执行，先构造React合成事件，然后以queue的方式调用JSX中声明的callback进行事件回调。

涉及到的主要类如下

ReactEventListener：负责事件注册和事件分发。React将DOM事件全都注册到document这个节点上，这个我们在事件注册小节详细讲。事件分发主要调用dispatchEvent进行，从事件触发组件开始，向父元素遍历。我们在事件执行小节详细讲。

ReactEventEmitter：负责每个组件上事件的执行。

EventPluginHub：负责事件的存储，合成事件以对象池的方式实现创建和销毁，大大提高了性能。

SimpleEventPlugin等plugin：根据不同的事件类型，构造不同的合成事件。如focus对应的React合成事件为SyntheticFocusEvent

React 事件如何被注册到React事件系统中的呢？

先得从组件创建和更新的入口方法mountComponent和updateComponent说起。在这两个方法中，都会调用到_updateDOMProperties方法，对JSX中声明的组件属性进行处理。源码如下

```js
_updateDOMProperties: function (lastProps, nextProps, transaction) {
    ... // 前面代码太长，省略一部分
    else if (registrationNameModules.hasOwnProperty(propKey)) {
        // 如果是props这个对象直接声明的属性，而不是从原型链中继承而来的，则处理它
        // nextProp表示要创建或者更新的属性，而lastProp则表示上一次的属性
        // 对于mountComponent，lastProp为null。updateComponent二者都不为null。unmountComponent则nextProp为null
        if (nextProp) {
          // mountComponent和updateComponent中，enqueuePutListener注册事件
          enqueuePutListener(this, propKey, nextProp, transaction);
        } else if (lastProp) {
          // unmountComponent中，删除注册的listener，防止内存泄漏
          deleteListener(this, propKey);
        }
    }
}
```

### 事件注册

事件注册即在 document 节点，将 React 事件转化为 DOM 原生事件，并注册回调。

```js
// enqueuePutListener 负责事件注册。
// inst：注册事件的 React 组件实例
// registrationName：React 事件，如：onClick、onChange
// listener：和事件绑定的 React 回调方法，如：handleClick、handleChange
// transaction：React 事务流，不懂没关系，不太影响对事件系统的理解
function enqueuePutListener(inst, registrationName, listener, transaction) {
    // 前面太长，省略一部分
    doc 为找到的 document 节点
    var doc = isDocumentFragment ? containerInfo._node : containerInfo._ownerDocument;
    // 事件注册
    listenTo(registrationName, doc);
    // 事件存储，之后会讲到，即存储事件回调方法
    transaction.getReactMountReady().enqueue(putListener, {
        inst: inst,
        registrationName: registrationName,
        listener: listener
    });
}
```

enqueuePutListener主要做两件事，一方面将事件注册到document这个原生DOM上（这就是为什么只有document这个节点有DOM事件的原因），另一方面采用事务队列的方式调用putListener将注册的事件存储起来，以供事件触发时回调。


注册事件的入口是listenTo方法, 它解决了不同浏览器间捕获和冒泡不兼容的问题。
```js
// 事件注册
// registrationName：React 事件名，如：onClick、onChange
// contentDocumentHandle：要将事件绑定到的 DOM 节点
listenTo: function (registrationName, contentDocumentHandle) {
    // document
    var mountAt = contentDocumentHandle;      
    // React 事件和绑定在根节点的 topEvent 的转化关系，如：onClick -> topClick
    var dependencies = EventPluginRegistry.registrationNameDependencies[registrationName];
    
    for (var i = 0; i < dependencies.length; i++){
        // 内部有大量判断浏览器兼容等的步骤，提取一下核心代码
        var dependency = dependencies[i];
        
        // topEvent 和原生 DOM 事件的转化关系
        if (topEventMapping.hasOwnProperty(dependency)) {
            // 三个参数为 topEvent、原生 DOM Event、Document
            // 将事件绑定到冒泡阶段
            trapBubbledEvent(dependency, topEventMapping[dependency], mountAt);
        }
    }
}
```

将事件绑定到冒泡阶段的具体代码

```js
// 三个参数为 topEvent、原生 DOM Event、Document（挂载节点）
trapBubbledEvent: function (topLevelType, handlerBaseName, element) {
    if (!element) {
        return null;
    }
    return EventListener.listen(element, handlerBaseName, ReactEventListener.dispatchEvent.bind(null, topLevelType));
}

// 三个参数为 Document（挂载节点）、原生 DOM Event、事件绑定函数
listen: function listen(target, eventType, callback) {
    // 去除浏览器兼容部分，留下核心后
    target.addEventListener(eventType, callback, false);
    // 返回一个解绑的函数
    return {
        remove: function remove() {
            target.removeEventListener(eventType, callback, false);
        }
    }
}
```

### 事件储存

```js
// inst：注册事件的 React 组件实例
// registrationName：React 事件，如：onClick、onChange
// listener：和事件绑定的 React 回调方法，如：handleClick、handleChange
putListener: function (inst, registrationName, listener) {
    // 核心代码如下
    // 生成每个组件实例唯一的标识符 key
    var key = getDictionaryKey(inst);
    // 获取某种 React 事件在回调存储银行中的对象
    var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[key] = listener;
}
```

listenerBank 是一个 React 事件和 React 组件的二维映射集合，通过访问 listenerBank[事件名][组件key]，就可以得到对应的绑定回调函数。

### 事件执行

每次触发事件都会执行根节点上 addEventListener 注册的回调，也就是 ReactEventListener.dispatchEvent 方法，事件分发入口函数。该函数的主要业务逻辑如下：
- 找到事件触发的 DOM 和 React Component
- 从该 React Component，调用 findParent 方法，遍历得到所有父组件，存在数组中。
- 从该组件直到最后一个父组件，根据之前事件存储，用 React 事件名 + 组件 key，找到对应绑定回调方法，执行，详细过程为：
  - 根据 DOM 事件构造 React 合成事件。
  - 将合成事件放入队列。
  - 批处理队列中的事件（包含之前未处理完的，先入先处理）

注：在调用回调时，有一个类似 listener(event) 的调用，所以事件绑定函数可以默认传参 event。

#### 事件分发
当事件触发时，document上addEventListener注册的callback会被回调。从前面事件注册部分发现，此时回调函数为ReactEventListener.dispatchEvent，它是事件分发的入口方法。下面我们来详细分析
```js
// topLevelType：带top的事件名，如topClick。不用纠结为什么带一个top字段，知道它是事件名就OK了
// nativeEvent: 用户触发click等事件时，浏览器传递的原生事件
dispatchEvent: function (topLevelType, nativeEvent) {
    // disable了则直接不回调相关方法
    if (!ReactEventListener._enabled) {
      return;
    }

    var bookKeeping = TopLevelCallbackBookKeeping.getPooled(topLevelType, nativeEvent);
    try {
      // 放入批处理队列中,React事件流也是一个消息队列的方式
      ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
    } finally {
      TopLevelCallbackBookKeeping.release(bookKeeping);
    }
}
```
可见我们仍然使用批处理的方式进行事件分发，handleTopLevelImpl才是事件分发的真正执行者，它是事件分发的核心，体现了React事件分发的特点，如下
```js
// document进行事件分发,这样具体的React组件才能得到响应。因为DOM事件是绑定到document上的
function handleTopLevelImpl(bookKeeping) {
  // 找到事件触发的DOM和React Component
  var nativeEventTarget = getEventTarget(bookKeeping.nativeEvent);
  var targetInst = ReactDOMComponentTree.getClosestInstanceFromNode(nativeEventTarget);

  // 执行事件回调前,先由当前组件向上遍历它的所有父组件。得到ancestors这个数组。
  // 因为事件回调中可能会改变Virtual DOM结构,所以要先遍历好组件层级
  var ancestor = targetInst;
  do {
    bookKeeping.ancestors.push(ancestor);
    ancestor = ancestor && findParent(ancestor);
  } while (ancestor);

  // 从当前组件向父组件遍历,依次执行注册的回调方法. 我们遍历构造ancestors数组时,是从当前组件向父组件回溯的,故此处事件回调也是这个顺序
  // 这个顺序就是冒泡的顺序,并且我们发现不能通过stopPropagation来阻止'冒泡'。
  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];
    ReactEventListener._handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
  }
}
```

#### 事件 callback 的调用
```js
事件处理由_handleTopLevel完成。它其实是调用ReactBrowserEventEmitter.handleTopLevel() ，如下

  // React事件调用的入口。DOM事件绑定在了document原生对象上,每次事件触发,都会调用到handleTopLevel
  handleTopLevel: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    // 采用对象池的方式构造出合成事件。不同的eventType的合成事件可能不同
    var events = EventPluginHub.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
    // 批处理队列中的events
    runEventQueueInBatch(events);
  }
```

handleTopLevel方法是事件callback调用的核心。它主要做两件事情，一方面利用浏览器回传的原生事件构造出React合成事件，另一方面采用队列的方式处理events。先看如何构造合成事件。

1. 构造合成事件
2. 批处理合成事件

## React合成事件和DOM原生事件混用须知

### 响应顺序
```js
class Demo extends React.PureComponent {
  componentDidMount() {
    const $this = ReactDOM.findDOMNode(this)
    $this.addEventListener('click', this.onDOMClick, false)
  }

  onDOMClick = evt => {
    console.log('dom event')
  }

  onClick = evt => {
    console.log('react event')
  }

  render() {
    return (
      <div onClick={this.onClick}>Demo</div>
    )
  }
}
```
最终输出为: 
```
dom event
react event
```

然后一个更复杂的例子

```js
class Demo extends React.PureComponent {
  componentDidMount() {
    const $parent = ReactDOM.findDOMNode(this)
    const $child = $parent.querySelector('.child')
    
    $parent.addEventListener('click', this.onParentDOMClick, false)
    $child.addEventListener('click', this.onChildDOMClick, false)
  }

  onParentDOMClick = evt => {
    console.log('parent dom event')
  }

  onChildDOMClick = evt => {
    console.log('child dom event')
  }    

  onParentClick = evt => {
    console.log('parent react event')
  }

  onChildClick = evt => {
    console.log('child react event')
  }

  render() {
    return (
        <div onClick={this.onParentClick}>
            <div className="child" onClick={this.onChildClick}>
                Demo
            </div>
        </div>
    )
  }
}

```

1. 合成事件的代理并不是在document上同时注册捕获/冒泡阶段的事件监听器的，事实上只有冒泡阶段的事件监听器，每一次DOM事件的触发，React会在event._dispatchListeners上注入所有需要执行的函数，然后依次循环执行。
2. 阻止原生事件的冒泡后，会阻止合成事件的监听器执行



## 引用
- [React 事件系统分析与最佳实践](https://zhuanlan.zhihu.com/p/27132447)
- [React源码分析6 — React合成事件系统](https://zhuanlan.zhihu.com/p/25883536)
- [react-event-system-and-source-code](https://www.lzane.com/tech/react-event-system-and-source-code/)