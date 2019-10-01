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