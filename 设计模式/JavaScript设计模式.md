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

发布-订阅模式可以广泛应用于异步编程中,这是一种替代传递回调函数的方案.发布-订阅模式可以取消对象之间硬编码的通知机制,让两个对象松耦合的联系在一起.

DOM事件就是一种发布-订阅模式(例如:addEventListener).

```JavaScript
//我们把发布—订阅的功能提取出来，放在一个单独的对象内：
var event = {
	clientList: [],
	listen: function( key, fn ){
		if ( !this.clientList[ key ] ){   //这的this就是event
			this.clientList[ key ] = [];
		}
			this.clientList[ key ].push( fn ); // 订阅的消息添加进缓存列表
		},
  trigger: function(){
    var key = Array.prototype.shift.call( arguments ), // (1);
    fns = this.clientList[ key ];
    if ( !fns || fns.length === 0 ){ // 如果没有绑定对应的消息
      return false;
    }
    for( var i = 0, fn; fn = fns[ i++ ]; ){
      fn.apply( this, arguments ); // (2) // arguments 是trigger 时带上的参数
    }
	}
};
//给所有的对象都动态的安装发布-订阅功能
var installEvent = function( obj ){
	for ( var i in event ){
		obj[ i ] = event[ i ];
	}
};
//取消订阅事件
event.remove = function( key, fn ){
  var fns = this.clientList[ key ];
  if ( !fns ){ // 如果key 对应的消息没有被人订阅，则直接返回
    return false;
  }
  if ( !fn ){ // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
    fns && ( fns.length = 0 );
  }else{
    for ( var l = fns.length - 1; l >=0; l-- ){ // 反向遍历订阅的回调函数列表
      var _fn = fns[ l ];
      if ( _fn === fn ){
        fns.splice( l, 1 ); // 删除订阅者的回调函数
      }
    }
  }
};

	//再来测试一番，我们给售楼处对象salesOffices 动态增加发布—订阅功能：
var salesOffices = {};
installEvent( salesOffices );
salesOffices.listen( 'squareMeter88', function( price ){ // 小明订阅消息
  console.log( '价格= ' + price );
});
salesOffices.listen( 'squareMeter100', function( price ){ // 小红订阅消息
  console.log( '价格= ' + price );
});
salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出：2000000
salesOffices.trigger( 'squareMeter100', 3000000 ); // 输出：3000000}




// 更好的实现
var Event = (function(){
		var clientList = {},
		listen,
		trigger,
		remove;
		listen = function( key, fn ){
			if ( !clientList[ key ] ){
				clientList[ key ] = [];
			}
			clientList[ key ].push( fn );
		};
		trigger = function(){
			var key = Array.prototype.shift.call( arguments ),
			fns = clientList[ key ];
			if ( !fns || fns.length === 0 ){
				return false;
			}
			for( var i = 0, fn; fn = fns[ i++ ]; ){
				fn.apply( this, arguments );
			}
		};
		remove = function( key, fn ){
			var fns = clientList[ key ];
			if ( !fns ){
				return false;
			}
			if ( !fn ){
				fns && ( fns.length = 0 );
			}else{
				for ( var l = fns.length - 1; l >=0; l-- ){
					var _fn = fns[ l ];
					if ( _fn === fn ){
						fns.splice( l, 1 );
					}
				}
			}
		};
		return {
			listen: listen,
			trigger: trigger,
			remove: remove
		}
	})();
Event.listen( 'squareMeter88', function( price ){ // 小红订阅消息
  console.log( '价格= ' + price ); // 输出：'价格=2000000'
});

Event.trigger( 'squareMeter88', 2000000 ); // 售楼处发布消息
```

上面的都是先发布再订阅,下面是完善版本.

```JavaScript
var Event = (function(){
  var global = this,
  Event,
  _default = 'default';
  Event = function(){
    var _listen,
    _trigger,
    _remove,
    _slice = Array.prototype.slice,
    _shift = Array.prototype.shift,
    _unshift = Array.prototype.unshift,
    namespaceCache = {},
    _create,
    find,
    each = function( ary, fn ){
      var ret;
      for ( var i = 0, l = ary.length; i < l; i++ ){
        var n = ary[i];
        ret = fn.call( n, i, n);
      }
      return ret;
    };
    _listen = function( key, fn, cache ){
      if ( !cache[ key ] ){
        cache[ key ] = [];
      }
      cache[key].push( fn );
    };
    _remove = function( key, cache ,fn){
      if ( cache[ key ] ){
        if( fn ){
          for( var i = cache[ key ].length; i >= 0; i-- ){
            if( cache[ key ] === fn ){
              cache[ key ].splice( i, 1 );
            }
          }
        }else{
          cache[ key ] = [];
        }
      }
    };
    _trigger = function(){
      var cache = _shift.call(arguments),
      key = _shift.call(arguments),
      args = arguments,
      _self = this,
      ret,
      stack = cache[ key ];
      if ( !stack || !stack.length ){
        return;
      }
      return each( stack, function(){
        return this.apply( _self, args );
      });
    };
    _create = function( namespace ){
      var namespace = namespace || _default;
      var cache = {},
      offlineStack = [], // 离线事件
      ret = {
        listen: function( key, fn, last ){
          _listen( key, fn, cache );
          if ( offlineStack === null ){
            return;
          }
          if ( last === 'last' ){
          }else{
            each( offlineStack, function(){
              this();
            });
          }
          offlineStack = null;
        },
        one: function( key, fn, last ){
          _remove( key, cache );
          this.listen( key, fn ,last );
        },
        remove: function( key, fn ){
          _remove( key, cache ,fn);
        },
        trigger: function(){
          var fn,
          args,
          _self = this;
          _unshift.call( arguments, cache );
          args = arguments;
          fn = function(){
            return _trigger.apply( _self, args );
          };
          if ( offlineStack ){
            return offlineStack.push( fn );
          }
          return fn();
        }
      };
      return namespace ?
      ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
        namespaceCache[ namespace ] = ret )
      : ret;
    };
    return {
      create: _create,
      one: function( key,fn, last ){
        var event = this.create( );
        event.one( key,fn,last );
      },
      remove: function( key,fn ){
        var event = this.create( );
        event.remove( key,fn );
      },
      listen: function( key, fn, last ){
        var event = this.create( );
        event.listen( key, fn, last );
      },
      trigger: function(){
        var event = this.create( );
        event.trigger.apply( this, arguments );
      }
    };
  }();
  return Event;
})();

```

