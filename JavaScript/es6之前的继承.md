

```js
// 寄生组合式继承
// 通过借用构造函数来继承属性, 通过原型链来继承方法
// 不必为了指定子类型的原型而调用父类型的构造函数,我们只需要父类型的一个副本而已
// 本质上就是使用寄生式继承来继承超类型的原型, 然后再将结果指定给子类型的原型
function object(o) { // ===Object.create()
  function F() { };
  F.prototype = o;
  return new F();
}
function c1(name) {
  this.name = name;
  this.color = ['red', 'green'];
}
c1.prototype.sayName = function () {
  console.log(this.name);
}
function c2(name, age) {
  c1.call(this, name)
  this.age = age
}
// 第一步:创建父类型原型的一个副本
// 第二步:为创建的副本添加 constructor 属性, 从而弥补因重写原型而失去的默认的 constructor 属性
// 第三步:将新创建的对象(即副本)赋值给子类型的原型
function inheritPrototype(superType, subType) {
  const prototype = object(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

inheritPrototype(c1, c2);
// c2的方法必须放在寄生继承之后
c2.prototype.sayAge = function () {
  console.log(this.age);
}
// const r = new c2('ll',11)
// const r2 = new c2('22',22)
// r.color.push('grey')  
// r.sayName();
// r.sayAge();
```

```js
// 最常用的继承, 组合继承
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;
```
