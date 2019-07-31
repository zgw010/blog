## 深拷贝
- 深度拷贝
```
// 就是把需要赋值的类型转为基本类型(字符串这些)而非引用类型来实现
// JOSN对象中的stringify可以把一个js对象序列化为一个JSON字符串，parse可以把JSON字符串反序列化为一个js对象

var deepClone = function(sourceObj) {
  if (!sourceObj || typeof sourceObj !== 'object') {
    console.log('您传入的不是对象!!');
    return;
  }
  // 转->解析->返回一步到位
  return window.JSON
    ? JSON.parse(JSON.stringify(sourceObj))
    : console.log('您的浏览器不支持 JSON API');
};
```

- [深拷贝的考虑点实际上要复杂的多,详情看看知乎怎么说](https://link.juejin.im?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F33489557)

```js
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }
    proto = Object.getPrototypeOf(obj);
    if (!proto) {
        return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}


function extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy, clone, copyIsArray;
    var length = arguments.length;
    // 记录要复制的对象的下标
    var i = 1;
    // 第一个参数不传布尔值的情况下，target 默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是 target
    if (typeof target == 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    // 如果target不是对象，我们是无法进行复制的，所以设为 {}
    if (typeof target !== "object" && !isFunction(target)) {
        target = {};
    }

    // 循环遍历要复制的对象们
    for (; i < length; i++) {
        // 获取当前对象
        options = arguments[i];
        // 要求不能为空 避免 extend(a,,b) 这种情况
        if (options != null) {
            for (name in options) {
                // 目标属性值
                src = target[name];
                // 要复制的对象的属性值
                copy = options[name];

                // 解决循环引用
                if (target === copy) {
                    continue;
                }

                // 要递归的对象必须是 plainObject 或者数组
                if (deep && copy && (isPlainObject(copy) ||
                        (copyIsArray = Array.isArray(copy)))) {
                    // 要复制的对象属性值类型需要与目标属性值相同
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, clone, copy);

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};
```


## Symbol
```js
const Symbol2Utils = {
  Symbol2Index: 0,
  generateName: function (descriptionString) {
    this.Symbol2Index++;
    const key = '__' + descriptionString + '__' + this.Symbol2Index + '__';
    return key;
  },
  forMap: new Map(),
}
const Symbol2 = function (description) {




  const symbol2 = Object.create({
    toString: function () {
      return 'Symbol2(' + this.__name__ + ')';
    },
    valueOf: function () {
      return 'Symbol2(' + this.__name__ + ')';
    },

  });

  // console.log(this);
  // console.log(this.__proto__);
  // console.log(Symbol2.prototype);
  // console.log(this.__proto__===Symbol2.prototype);

  if (this instanceof Symbol2) throw new TypeError('Symbol2 is not a constructor'); // Symbol 不能用 new 调用

  const descriptionString = description === undefined ? undefined : String(description);
  Object.defineProperties(symbol2, {
    'description': {
      value: descriptionString,
      // writable: false, // true 当且仅当与该属性相关联的值可以用assignment operator改变时。默认为 false
      // enumerable: false, // true 当且仅当在枚举相应对象上的属性时该属性显现。默认为 false
      // configurable: false // true 当且仅当该属性描述符的类型可以被改变并且该属性可以从对应对象中删除。默认为 false
    },
    '__name__': {
      value: Symbol2Utils.generateName(descriptionString),
    },

  });
  return symbol2;
}
Object.defineProperties(Symbol2, {
  'for': {
    value: function (key) {
      if (!Symbol2Utils.forMap.has(key)) {
        Symbol2Utils.forMap.set(key, Symbol2(key));
      }
      return Symbol2Utils.forMap.get(key);
    }
  },
  'keyFor': {
    value: function (symbol2) {
      for (const key in forMap) {
        if (forMap[key] === symbol2) return key;
      }
    }
  },
});
var a = Symbol2('foo');
var b = Symbol2('foo');

console.log(a, b);

console.log(a.description);
console.log(a.toString());
console.log(Symbol2.for("bar") === Symbol2.for("bar"));


Symbol2("bar") === Symbol2("bar")
```

引用:

> https://github.com/mqyqingfeng/Blog/issues/87
> http://es6.ruanyifeng.com/