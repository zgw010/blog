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
  if ( typeof vnode === 'string' ) {
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
      //如果不 container.innerHTML = '' 多次render不会清楚原来的内容
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

//ok,第一部分完成!
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
}
```

