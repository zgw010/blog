> 出自https://github.com/hujiulong/blog/issues

# JSX和虚拟DOM

> ### JSX 简介
>
> 我们来观察一下声明的这个变量：
>
> ```jsx
> const element = <h1>Hello, world!</h1>;
> ```
>
> 这种看起来可能有些奇怪的标签语法既不是字符串也不是 HTML。
>
> 它被称为 JSX， 一种 JavaScript 的语法扩展。 我们推荐在 React 中使用 JSX 来描述用户界面。JSX 乍看起来可能比较像是模版语言，但事实上它完全是在 JavaScript 内部实现的。

## React.createElement和虚拟DOM

 在Rreact中JSX会被被React.createElement包裹的代码,例如上面的代码会被转变为

```JavaScript
"use strict";

var element = React.createElement(
  "h1",
  null,
  "Hello, world!"
);
```

接下来就实现一个简单的createElement()

```js
function createElement(tag,attrs,...children){
  return {
    tag,
    attrs,
    children
  }
}
const React = {
  createElement
}
//测试
const element = (
    <div>
        hello<span>world!</span>
    </div>
);
console.log( element );
```

这个返回的对象暂且称为**虚拟DOM**.

## ReactDOM.render

render函数有两个参数,第一个参数是上面返回的虚拟DOM对象,第二个参数是一个真实的DOM节点,render的作用就是将虚拟DOM渲染成真实DOM,并将其挂载到真实的DOM节点上.

```js
function render( vnode, container ) {
  // 当vnode为字符串时，渲染结果是一段文本
  if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
      const textNode = document.createTextNode( vnode );
      return container.appendChild( textNode );
  }

  const dom = document.createElement( vnode.tag );
	
  //如果有属性就遍历属性设置到dom节点上
  if ( vnode.attrs ) {
      Object.keys( vnode.attrs ).forEach( key => {
          const value = vnode.attrs[ key ];
           setAttribute( dom, key, value );    // 设置属性
      } );
  }

  vnode.children.forEach( child => render( child, dom ) );    // 递归渲染子节点

  return container.appendChild( dom );    // 将渲染结果挂载到真正的DOM上
}


//由于设置属性要考虑的情况比较复杂,单独拿出来写一个函数
function setAttribute( dom, name, value ) {
  // 如果属性名是className，则改回class
  if ( name === 'className' ) {
    name = 'class';
  }

  // 如果属性名是onXXX，则是一个事件监听方法
  if (name.startWith('on')) {
    name = name.toLowerCase();
    dom[ name ] = value || '';
    // 如果属性名是style，则更新style对象
    // 我一般写React内联css都是以style={{"":"","":""}}这种风格写的,这也是React官方推荐的内联css写法
    //这里选择把上述格式的css转化为cssText复制给DOM节点的做法
    //关于cssText,这里有简单介绍 https://www.cnblogs.com/snandy/archive/2011/03/12/1980444.html
  } else if ( name === 'style' ) {
    let domStyle="";
    for(let i in value){
      let styleValue=value[i];
      // 下面这个while循环负责把驼峰式的值改为标准的css属性值
      while(/[A-Z]/.test(i)){
      i=i.replace(/[A-Z]/,function(char){
          return "-"+char.toLowerCase();
      })
    }
    domStyle=domStyle+i+":"+styleValue+";";
    dom.style.cssText=domStyle;   //把从style对象获得到的style给dom节点
    }
  }
  // 普通属性则直接更新属性
  } else {
    if ( name in dom ) {
      dom[ name ] = value || '';
    }
    if ( value ) {
      dom.setAttribute( name, value );
    } else {
      dom.removeAttribute( name, value );
    }
  }
}


//下面把render添加到ReactDom对象里
const ReactDOM = {
    render: ( vnode, container ) => {
      //如果不 container.innerHTML = '' 多次render不会清除原来的内容
        container.innerHTML = '';
        return render( vnode, container );
    }
}

//下面就可以试着跑下官方的helloworld了,这里为了可以直接在浏览器运行,我用babel转化了JSX
ReactDOM.render(React.createElement(
  'h1',
  null,
  'Hello, world!'
), document.getElementById('root'));
// 完全ok,helloWord!

//跑一个更复杂点的

function tick() {
    var element = React.createElement(
        'div',
        null,
        React.createElement(
            'h1',
            null,
            'Hello, world!'
        ),
        React.createElement(
            'h2',
            null,
            'It is ',
            new Date().toLocaleTimeString(),
            '.'                     //颜文字无处不在
        )
    );
    ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);

```

再完善下上面的代码,render函数的作用是渲染dom节点,并且把它挂载到真实dom节点上,由于后面需要用到一个函数,只负责渲染dom节点,所以把render函数拆分一下,另外完善下类型检测.

```js
function render(vnode, container) {
  return container.appendChild(_render(vnode));
}

function _render(vnode) {

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'number') vnode = String(vnode);

  if (typeof vnode === 'string') {
    let textNode = document.createTextNode(vnode);
    return textNode;
  }

  if (typeof vnode.tag === 'function') {

    const component = createComponent(vnode.tag, vnode.attrs);

    setComponentProps(component, vnode.attrs);

    return component.base;
  }

  const dom = document.createElement(vnode.tag);

  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {

      const value = vnode.attrs[key];

      setAttribute(dom, key, value);

    });
  }

  if (vnode.children) {
    vnode.children.forEach(child => render(child, dom));
  }

  return dom;
}
```



# 组件和生命周期

我们的createElement长这个样子

```js
function createElement(tag,attrs,...children){
  return {
    tag,
    attrs,
    children
  }
}
```

当我们传入一个react组件时,tag就不是一个字符串了,而是一个函数,这个函数就是我们定义tag的函数.

## 组件基类React.Component

 定义类组件的时候都要继承自React.Component,接下来就实现这个基类.

```js
class Component {
  constructor( props = {} ) {
      this.state = {};
      this.props = props;
  }
  //React的setState比下面的复杂得多,这里仅仅是一个极简的版本
  //关于setState,知乎有一篇很深入的文章https://github.com/Hasaki1997/blog/blob/master/react/setState.md
  setState(newState){
    Object.assign(this.state,newState);
    //React的视图由状态决定,状态发生改变,视图随之改变
    renderComponent(this);
  }
}
```

为了支持渲染React组件我们在render中加入一段下面的代码

```js
if ( typeof vnode.tag === 'function' ) {

  const component = createComponent( vnode.tag, vnode.attrs );

  setComponentProps( component, vnode.attrs );
	//component.base保存的是组件的dom对象，反过来base._component保存的是dom对象所对应的组件，这个就是为了把他们关联起来
  return component.base;
}
```

## 组件渲染和生命周期

> 关于[React的生命周期](https://github.com/Hasaki1997/blog/blob/master/react/React%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.md)

 上面用到了createComponent和setComponentProps两个函数,下面来实现它们,组件的生命周期也会在这里实现

`createComponent`方法用来创建组件实例，并且将函数定义组件扩展为类定义组件进行处理，以免其他地方需要区分不同定义方式。

```js
// 创建组件
function createComponent( component, props ) {

  let inst;
  // 如果是类定义组件，则直接返回实例
  if ( component.prototype && component.prototype.render ) {
    inst = new component( props );
  // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
    inst = new Component( props );
    inst.constructor = component;
    inst.render = function() {
      return this.constructor( props );
    }
  }

  return inst;
}
```

`setComponentProps`方法用来更新`props`，在其中可以实现`componentWillMount`，`componentWillReceiveProps`两个生命周期方法

```js
// set props
function setComponentProps( component, props ) {

  if ( !component.base ) {
  	if ( component.componentWillMount ) component.componentWillMount();
	} else if ( component.componentWillReceiveProps ) {
  	component.componentWillReceiveProps( props );
	}

  component.props = props;

  renderComponent( component );

}
```

renderComponent方法用来渲染组件，setState方法中会直接调用这个方法进行重新渲染，在这个方法里可以实现`componentWillUpdate`，`componentDidUpdate`，`componentDidMount`几个生命周期方法。

```js
export function renderComponent( component ) {

  let base;

  const renderer = component.render();

  if ( component.base && component.componentWillUpdate ) {
    component.componentWillUpdate();
  }

  base = _render( renderer );

  if ( component.base ) {
    if ( component.componentDidUpdate ) component.componentDidUpdate();
  } else if ( component.componentDidMount ) {
    component.componentDidMount();
  }

  if ( component.base && component.base.parentNode ) {
    component.base.parentNode.replaceChild( base, component.base );
  }
  //component.base保存的是组件的dom对象，反过来base._component保存的是dom对象所对应的组件，这个就是为了把他们关联起来
  component.base = base;
  base._component = component;

}
```

 # diff算法

## 对比文本节点

首先考虑最简单的文本节点，如果当前的DOM就是文本节点，则直接更新内容，否则就新建一个文本节点，并移除掉原来的DOM。

```js
// diff text node
if (typeof vnode === 'string') {

  // 如果当前的DOM就是文本节点，则直接更新内容
  if (dom && dom.nodeType === 3) { // nodeType: https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
    if (dom.textContent !== vnode) {
      dom.textContent = vnode;
    }
    // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
  } else {
    out = document.createTextNode(vnode);
    if (dom && dom.parentNode) {
      dom.parentNode.replaceChild(out, dom);
    }
  }

  return out;
}
```

文本节点十分简单，它没有属性，也没有子元素，所以这一步结束后就可以直接返回结果了。

## 对比非文本DOM节点

如果vnode表示的是一个非文本的DOM节点，那就要分几种情况了：
如果真实DOM和虚拟DOM的类型不同，例如当前真实DOM是一个div，而vnode的tag的值是'button'，那么原来的div就没有利用价值了，直接新建一个button元素，并将div的所有子节点移到button下，然后用replaceChild方法将div替换成button。

```js
if (!dom || dom.nodeName.toLowerCase() !== vnode.tag.toLowerCase()) {
  out = document.createElement(vnode.tag);

  if (dom) {
    [...dom.childNodes].map(out.appendChild); // 将原来的子节点移到新节点下

    if (dom.parentNode) {
      dom.parentNode.replaceChild(out, dom); // 移除掉原来的DOM对象
    }
  }
}
```

如果真实DOM和虚拟DOM是同一类型的，那我们暂时不需要做别的，只需要等待后面对比属性和对比子节点。

## 对比属性

实际上diff算法不仅仅是找出节点类型的变化，它还要找出来节点的属性以及事件监听的变化。我们将对比属性单独拿出来作为一个方法：

```js
function diffAttributes(dom, vnode) {

  const old = {}; // 当前DOM的属性
  const attrs = vnode.attrs; // 虚拟DOM的属性

  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i];
    old[attr.name] = attr.value;
  }

  // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
  for (let name in old) {

    if (!(name in attrs)) {
      setAttribute(dom, name, undefined);
    }

  }

  // 更新新的属性值
  for (let name in attrs) {

    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name]);
    }

  }

}
```

setAttribute方法的实现参见[第一篇文章](https://github.com/hujiulong/blog/issues/4)

## 对比子节点

节点本身对比完成了，接下来就是对比它的子节点。
这里会面临一个问题，前面我们实现的不同diff方法，都是明确知道哪一个真实DOM和虚拟DOM对比，但是子节点是一个数组，它们可能改变了顺序，或者数量有所变化，我们很难确定要和虚拟DOM对比的是哪一个。
为了简化逻辑，我们可以让用户提供一些线索：给节点设一个key值，重新渲染时对比key值相同的节点。

```js
// diff方法
if ( vnode.children && vnode.children.length > 0 || ( out.childNodes && out.childNodes.length > 0 ) ) {
  diffChildren( out, vnode.children );
}
```

```js
function diffChildren(dom, vchildren) {

  const domChildren = dom.childNodes;
  const children = [];

  const keyed = {};

  // 将有key的节点和没有key的节点分开
  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i];
      const key = child.key;
      if (key) {
        keyedLen++;
        keyed[key] = child;
      } else {
        children.push(child);
      }
    }
  }

  if (vchildren && vchildren.length > 0) {

    let min = 0;
    let childrenLen = children.length;

    for (let i = 0; i < vchildren.length; i++) {

      const vchild = vchildren[i];
      const key = vchild.key;
      let child;

      // 如果有key，找到对应key值的节点
      if (key) {

        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }

        // 如果没有key，则优先找类型相同的节点
      } else if (min < childrenLen) {

        for (let j = min; j < childrenLen; j++) {

          let c = children[j];

          if (c && isSameNodeType(c, vchild)) {

            child = c;
            children[j] = undefined;

            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;

          }

        }

      }

      // 对比
      child = diff(child, vchild);

      // 更新DOM
      const f = domChildren[i];
      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }

    }
  }

}
```

## 对比组件

如果vnode是一个组件，我们也单独拿出来作为一个方法:

```js
function diffComponent(dom, vnode) {

  let c = dom && dom._component;
  let oldDom = dom;

  // 如果组件类型没有变化，则重新set props
  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs);
    dom = c.base;
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  } else {

    if (c) {
      unmountComponent(c);
      oldDom = null;
    }

    c = createComponent(vnode.tag, vnode.attrs);

    setComponentProps(c, vnode.attrs);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }

  }

  return dom;

}
```

下面是相关的工具方法的实现，和[上一篇文章](https://github.com/hujiulong/blog/issues/5)的实现相比，只需要修改renderComponent方法其中的一行。

```js
function renderComponent(component) {

  // ...

  // base = base = _render( renderer );          // 将_render改成diff
  base = diff(component.base, renderer);

  // ...
}
```

