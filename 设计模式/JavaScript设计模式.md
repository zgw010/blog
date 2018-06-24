# 单例模式

> 保证一个类仅有一个实例,并提供一个访问它的全局访问点.

单例模式实现的方法一般是先判断实例存在与否，如果存在直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。在JavaScript里，单例作为一个命名空间提供者，从全局命名空间里提供一个唯一的访问点来访问该对象。

```javascript
const Singleton = function(name){
  this.name = name;
}
Singleton.prototype.getName = function(){
  alert(this.name);
}
Singleton.getInstance = (function(){
  let instance = null;
  return function(name){
    if(!instance){
			instance = new Singleton(name);
    }
    return instance;
  }
})();

//测试
const a = Singleton.getInstance('a');
const b = Singleton.getInstance('b');
console.log(a===b)
```

```javascript
const getSingle = function(fn){
  let result;
  return function(){
    return result||result = fn.apply(this,arguments);
  }
};
var createLoginLayer = function(){
  var div = document.createElement( 'div' );
  div.innerHTML = '我是登录浮窗';
  div.style.display = 'none';
  document.body.appendChild( div );
  return div;
};
var createSingleLoginLayer = getSingle( createLoginLayer );
document.getElementById( 'loginBtn' ).onclick = function(){
  var loginLayer = createSingleLoginLayer();
  loginLayer.style.display = 'block';
};

//下面我们再试试创建唯一的iframe 用于动态加载第三方页面：
var createSingleIframe = getSingle( function(){
  var iframe = document.createElement ( 'iframe' );
  document.body.appendChild( iframe );
  return iframe;
});
document.getElementById( 'loginBtn' ).onclick = function(){
  var loginLayer = createSingleIframe();
  loginLayer.src = 'http://baidu.com';
};
```

```html
//例子
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <button id="loginBtn">aaaa</button>
  <button id="login">bbb</button>
  <script>
    const getSingle = function(fn){
      let result;
      return function(){
        return result||(result = fn.apply(this,arguments));
      }
    };
    var createLoginLayer = function(){
      var div = document.createElement( 'div' );
      div.innerHTML = '我是登录浮窗';
      div.style.display = 'none';
      document.body.appendChild( div );
      return div;
    };
    var createSingleLoginLayer = getSingle( createLoginLayer );
    document.getElementById( 'loginBtn' ).onclick = function(){
      var loginLayer = createSingleLoginLayer();
      loginLayer.style.display = 'block';
    };
    var createSingleIframe = getSingle( function(){
      var iframe = document.createElement ( 'iframe' );
      document.body.appendChild( iframe );
      return iframe;
    });
    document.getElementById( 'login' ).onclick = function(){
      var loginLayer = createSingleIframe();
      loginLayer.src = 'http://baidu.com';
    };
  </script>
</body>
</html>
```

# 发布-订阅模式

> 发布-订阅模式又叫观察者模式,它定义对象间的一种一对多的依赖关系,当一个对象的状态发生改变时,所有依赖于它的对象都将得到通知.在JavaScript开发中,我们一般用事件模型来替代传统的发布-订阅模式.