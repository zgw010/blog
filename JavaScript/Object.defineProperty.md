## Object.defineProperty()
>Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

---
### 语法
>Object.defineProperty(obj, prop, descriptor)

例子
```
var a= {}
Object.defineProperty(a,"b",{
  value:123
})
console.log(a.b);//123
```
* 参数
`obj`:要在其上定义属性的对象。
`prop`:要定义或修改的属性的名称。
`descriptor`:将被定义或修改的属性描述符。
* 返回值
被传递给函数的对象。
* ES6
在ES6中，由于 Symbol类型的特殊性，用Symbol类型的值来做对象的key与常规的定义或修改不同，而Object.defineProperty 是定义key为Symbol的属性的方法之一。
---
### 描述


该方法允许精确添加或修改对象的属性。通过赋值来添加的普通属性会创建在属性枚举期间显示的属性（`for...in` 或 `Object.keys` 方法）， 这些值可以被改变，也可以被删除。这种方法允许这些额外的细节从默认值改变。默认情况下，使用`Object.defineProperty()`添加的属性值是不可变的。

---
### 属性描述符
 

对象里目前存在的属性描述符有两种主要形式：**数据描述符**和**存取描述符**。**数据描述符**是一个具有值的属性，该值可能是可写的，也可能不是可写的。**存取描述符**是由`getter-setter`函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者。

**数据描述符和存取描述符均具有**以下可选键值：

`configurable`
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。==__默认为 false。__==
>==!!!== 第一次设置 false 之后，第二次什么设置也不行了.即可以先设置为true再设置为false,而不能先设置为false,再设置为true.

`enumerable`
当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。==__默认为 false。__==

__数据描述符同时具有以下可选键值：__
`value`
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。==__默认为 undefined。__==
`writable`
当且仅当该属性的writable为true时，value才能被赋值运算符改变。==__默认为 false。__==

__存取描述符同时具有以下可选键值：__
>在 descriptor 中不能同时设置访问器（get 和 set）和 wriable 或 value，否则会错，就是说想用 get 和 set，就不能用 writable 或 value 中的任何一个。

`get`
一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。==__默认为 undefined。__==
`set`
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。==__默认为 undefined。__==

例子
```
var a= {}
Object.definePrope`请输入代码`rty(a,"b",{
  set:function(newValue){
    console.log("你要赋值给我,我的新值是"＋newValue)
    },
  get:function(){
    console.log("你取我的值")
    return 2 //注意这里，我硬编码返回2
   }
})
a.b =1 //打印 你要赋值给我,我的新值是1
console.log(a.b)    //打印 你取我的值
                    //打印 2    注意这里，和我的硬编码相同的
```

以上属性都有默认值所以上面的例子等价于下面的代码
```
var a= {}
Object.defineProperty(a,"b",{
  value:123,
  writable:false,
  enumerable:false,
  configurable:false
})
console.log(a.b);//123
```

