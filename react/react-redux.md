> 来自http://106.14.185.196/zt/js-redux.html

<section class="normal markdown-section">
                          

<h1 id="react-redux_之_connect_方法详解">react-redux 之 connect 方法详解</h1>

<p><img src="http://img.alicdn.com/tfs/TB1fYYeLpXXXXbtXFXXXXXXXXXX-900-500.jpg" alt="React 实践心得：react-redux 之 connect 方法详解"></p>
<p>Redux 是「React 全家桶」中极为重要的一员，它试图为 React 应用提供「可预测化的状态管理」机制。Redux 本身足够简单，除了 React，它还能够支持其他界面框架。所以如果要将 Redux 和 React 结合起来使用，就还需要一些额外的工具，其中最重要的莫过于 react-redux 了。</p>
<p>react-redux 提供了两个重要的对象，<code>Provider</code> 和 <code>connect</code>，前者使 React 组件可被连接（connectable），后者把 React 组件和 Redux 的 store 真正连接起来。react-redux 的文档中，对 <code>connect</code> 的描述是一段晦涩难懂的英文，在初学 redux 的时候，我对着这段文档阅读了很久，都没有全部弄明白其中的意思（大概就是，单词我都认识，连起来啥意思就不明白了的感觉吧）。</p>
<p>在使用了一段时间 redux 后，本文尝试再次回到这里，给<a href="https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options" target="_blank">这段文档</a>（同时摘抄在附录中）一个靠谱的解读。</p>
<h2 id="预备知识">1. 预备知识</h2>
<p>首先回顾一下 redux 的基本用法。如果你还没有阅读过 redux 的文档，你一定要先去<a href="https://github.com/reactjs/redux/blob/master/docs/README.md" target="_blank">阅读一下</a>。</p>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> reducer = <span class="hljs-function">(<span class="hljs-params">state = {count: <span class="hljs-number">0</span>}, action</span>) =&gt;</span> {
  <span class="hljs-keyword">switch</span> (action.type){
    <span class="hljs-keyword">case</span> <span class="hljs-string">'INCREASE'</span>: <span class="hljs-keyword">return</span> {<span class="hljs-attr">count</span>: state.count + <span class="hljs-number">1</span>};
    <span class="hljs-keyword">case</span> <span class="hljs-string">'DECREASE'</span>: <span class="hljs-keyword">return</span> {<span class="hljs-attr">count</span>: state.count - <span class="hljs-number">1</span>};
    <span class="hljs-keyword">default</span>: <span class="hljs-keyword">return</span> state;
  }
}

<span class="hljs-keyword">const</span> actions = {
  <span class="hljs-attr">increase</span>: <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> ({<span class="hljs-attr">type</span>: <span class="hljs-string">'INCREASE'</span>}),
  <span class="hljs-attr">decrease</span>: <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> ({<span class="hljs-attr">type</span>: <span class="hljs-string">'DECREASE'</span>})
}

<span class="hljs-keyword">const</span> store = createStore(reducer);

store.subscribe(<span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span>
  <span class="hljs-built_in">console</span>.log(store.getState())
);

store.dispatch(actions.increase()) <span class="hljs-comment">// {count: 1}</span>
store.dispatch(actions.increase()) <span class="hljs-comment">// {count: 2}</span>
store.dispatch(actions.increase()) <span class="hljs-comment">// {count: 3}</span>
</code></pre>
<p>通过 <code>reducer</code> 创建一个 <code>store</code>，每当我们在 <code>store</code> 上 <code>dispatch</code> 一个 <code>action</code>，<code>store</code> 内的数据就会相应地发生变化。</p>
<p>我们当然可以<strong>直接</strong>在 React 中使用 Redux：在最外层容器组件中初始化 <code>store</code>，然后将 <code>state</code> 上的属性作为 <code>props</code> 层层传递下去。</p>
<pre><code class="lang-js"><span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">App</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Component</span></span>{

  componentWillMount(){
    store.subscribe(<span class="hljs-function">(<span class="hljs-params">state</span>)=&gt;</span><span class="hljs-keyword">this</span>.setState(state))
  }

  render(){
    <span class="hljs-keyword">return</span> <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">Comp</span> <span class="hljs-attr">state</span>=<span class="hljs-string">{this.state}</span>
                 <span class="hljs-attr">onIncrease</span>=<span class="hljs-string">{()</span>=&gt;</span>store.dispatch(actions.increase())}
                 onDecrease={()=&gt;store.dispatch(actions.decrease())}
    /&gt;
  }
}
</span></code></pre>
<p>但这并不是最佳的方式。最佳的方式是使用 react-redux 提供的 <code>Provider</code> 和 <code>connect</code> 方法。</p>
<h2 id="使用_react-redux">2. 使用 react-redux</h2>
<p>首先在最外层容器中，把所有内容包裹在 <code>Provider</code> 组件中，将之前创建的 <code>store</code> 作为 <code>prop</code> 传给 <code>Provider</code>。</p>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> App = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> {
  <span class="hljs-keyword">return</span> (
    <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">Provider</span> <span class="hljs-attr">store</span>=<span class="hljs-string">{store}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Comp</span>/&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">Provider</span>&gt;</span></span>
  )
};
</code></pre>
<p><code>Provider</code> 内的任何一个组件（比如这里的 <code>Comp</code>），如果需要使用 <code>state</code> 中的数据，就必须是「被 connect 过的」组件——使用 <code>connect</code> 方法对「你编写的组件（<code>MyComp</code>）」进行包装后的产物。</p>
<pre><code class="lang-js"><span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">MyComp</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Component</span> </span>{
  <span class="hljs-comment">// content...</span>
}

<span class="hljs-keyword">const</span> Comp = connect(...args)(MyComp);
</code></pre>
<p>可见，<code>connect</code> 方法是重中之重。</p>
<h2 id="connect_详解">3. connect 详解</h2>
<p>究竟 <code>connect</code> 方法到底做了什么，我们来一探究竟。</p>
<p>首先看下函数的签名：</p>
<blockquote>
<p>connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])</p>
</blockquote>
<p><code>connect()</code> 接收四个参数，它们分别是 <code>mapStateToProps</code>，<code>mapDispatchToProps</code>，<code>mergeProps</code>和<code>options</code>。</p>
<h3 id="mapStateToProps(state__ownProps)_:_stateProps">3.1. mapStateToProps(state, ownProps) : stateProps</h3>
<p>这个函数允许我们将 <code>store</code> 中的数据作为 <code>props</code> 绑定到组件上。</p>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> mapStateToProps = <span class="hljs-function">(<span class="hljs-params">state</span>) =&gt;</span> {
  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">count</span>: state.count
  }
}
</code></pre>
<p>这个函数的第一个参数就是 Redux 的 <code>store</code>，我们从中摘取了 <code>count</code> 属性。因为返回了具有 <code>count</code> 属性的对象，所以 <code>MyComp</code> 会有名为 <code>count</code> 的 <code>props</code> 字段。</p>
<pre><code class="lang-js"><span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">MyComp</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Component</span> </span>{
  render(){
    <span class="hljs-keyword">return</span> <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>计数：{this.props.count}次<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  }
}

<span class="hljs-keyword">const</span> Comp = connect(...args)(MyComp);
</code></pre>
<p>当然，你不必将 <code>state</code> 中的数据原封不动地传入组件，可以根据 <code>state</code> 中的数据，动态地输出组件需要的（最小）属性。</p>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> mapStateToProps = <span class="hljs-function">(<span class="hljs-params">state</span>) =&gt;</span> {
  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">greaterThanFive</span>: state.count &gt; <span class="hljs-number">5</span>
  }
}
</code></pre>
<p>函数的第二个参数 <code>ownProps</code>，是 <code>MyComp</code> 自己的 <code>props</code>。有的时候，<code>ownProps</code> 也会对其产生影响。比如，当你在 <code>store</code> 中维护了一个用户列表，而你的组件 <code>MyComp</code> 只关心一个用户（通过 <code>props</code> 中的 <code>userId</code> 体现）。</p>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> mapStateToProps = <span class="hljs-function">(<span class="hljs-params">state, ownProps</span>) =&gt;</span> {
  <span class="hljs-comment">// state 是 {userList: [{id: 0, name: '王二'}]}</span>
  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">user</span>: _.find(state.userList, {<span class="hljs-attr">id</span>: ownProps.userId})
  }
}

<span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">MyComp</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Component</span> </span>{

  <span class="hljs-keyword">static</span> PropTypes = {
    <span class="hljs-attr">userId</span>: PropTypes.string.isRequired,
    <span class="hljs-attr">user</span>: PropTypes.object
  };

  render(){
    <span class="hljs-keyword">return</span> <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>用户名：{this.props.user.name}<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  }
}

<span class="hljs-keyword">const</span> Comp = connect(mapStateToProps)(MyComp);
</code></pre>
<p>当 <code>state</code> 变化，或者 <code>ownProps</code> 变化的时候，<code>mapStateToProps</code> 都会被调用，计算出一个新的 <code>stateProps</code>，（在与 <code>ownProps</code> merge 后）更新给 <code>MyComp</code>。</p>
<p>这就是将 Redux <code>store</code> 中的数据连接到组件的基本方式。</p>
<h3 id="mapDispatchToProps(dispatch__ownProps):_dispatchProps">3.2. mapDispatchToProps(dispatch, ownProps): dispatchProps</h3>
<p><code>connect</code> 的第二个参数是 <code>mapDispatchToProps</code>，它的功能是，将 action 作为 <code>props</code> 绑定到 <code>MyComp</code> 上。</p>
<pre><code class="lang-js"><span class="hljs-keyword">const</span> mapDispatchToProps = <span class="hljs-function">(<span class="hljs-params">dispatch, ownProps</span>) =&gt;</span> {
  <span class="hljs-keyword">return</span> {
    <span class="hljs-attr">increase</span>: <span class="hljs-function">(<span class="hljs-params">...args</span>) =&gt;</span> dispatch(actions.increase(...args)),
    <span class="hljs-attr">decrease</span>: <span class="hljs-function">(<span class="hljs-params">...args</span>) =&gt;</span> dispatch(actions.decrease(...args))
  }
}

<span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">MyComp</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Component</span> </span>{
  render(){
    <span class="hljs-keyword">const</span> {count, increase, decrease} = <span class="hljs-keyword">this</span>.props;
    <span class="hljs-keyword">return</span> (<span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>计数：{this.props.count}次<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{increase}</span>&gt;</span>增加<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{decrease}</span>&gt;</span>减少<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>)
  }
}

<span class="hljs-keyword">const</span> Comp = connect(mapStateToProps， mapDispatchToProps)(MyComp);
</code></pre>
<p>由于 <code>mapDispatchToProps</code> 方法返回了具有 <code>increase</code> 属性和 <code>decrease</code> 属性的对象，这两个属性也会成为 <code>MyComp</code> 的 <code>props</code>。</p>
<p>如上所示，调用 <code>actions.increase()</code> 只能得到一个 <code>action</code> 对象 <code>{type:'INCREASE'}</code>，要触发这个 <code>action</code> 必须在 <code>store</code> 上调用 <code>dispatch</code> 方法。<code>diapatch</code> 正是 <code>mapDispatchToProps</code> 的第一个参数。但是，为了不让 <code>MyComp</code> 组件感知到 <code>dispatch</code> 的存在，我们需要将 <code>increase</code> 和 <code>decrease</code> 两个函数包装一下，使之成为直接可被调用的函数（即，调用该方法就会触发 <code>dispatch</code>）。</p>
<p>Redux 本身提供了 <code>bindActionCreators</code> 函数，来将 action 包装成直接可被调用的函数。</p>
<pre><code class="lang-js"><span class="hljs-keyword">import</span> {bindActionCreators} <span class="hljs-keyword">from</span> <span class="hljs-string">'redux'</span>;

<span class="hljs-keyword">const</span> mapDispatchToProps = <span class="hljs-function">(<span class="hljs-params">dispatch, ownProps</span>) =&gt;</span> {
  <span class="hljs-keyword">return</span> bindActionCreators({
    <span class="hljs-attr">increase</span>: action.increase,
    <span class="hljs-attr">decrease</span>: action.decrease
  });
}
</code></pre>
<p>同样，当 <code>ownProps</code> 变化的时候，该函数也会被调用，生成一个新的 <code>dispatchProps</code>，（在与 <code>statePrope</code> 和 <code>ownProps</code> merge 后）更新给 <code>MyComp</code>。注意，<code>action</code> 的变化不会引起上述过程，默认 <code>action</code> 在组件的生命周期中是固定的。</p>
<h3 id="[mergeProps(stateProps__dispatchProps__ownProps):_props]">3.3. [mergeProps(stateProps, dispatchProps, ownProps): props]</h3>
<p>之前说过，不管是 <code>stateProps</code> 还是 <code>dispatchProps</code>，都需要和 <code>ownProps</code> merge 之后才会被赋给 <code>MyComp</code>。<code>connect</code> 的第三个参数就是用来做这件事。通常情况下，你可以不传这个参数，<code>connect</code> 就会使用 <code>Object.assign</code> 替代该方法。</p>
<h3 id="其他">3.4. 其他</h3>
<p>最后还有一个 <code>options</code> 选项，比较简单，基本上也不大会用到（尤其是你遵循了其他的一些 React 的「最佳实践」的时候），本文就略过了。希望了解的同学可以直接看文档。</p>
<p>（完）</p>
<h2 id="附：connect_方法的官方英文文档">4. 附：connect 方法的官方英文文档</h2>
<blockquote>
<h4 id="connect([mapStateToProps]__[mapDispatchToProps]__[mergeProps]__[options])">4.0.1. connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])</h4>
<p>Connects a React component to a Redux store.</p>
<p>It does not modify the component class passed to it. Instead, it returns a new, connected component class, for you to use.</p>
<h4 id="Arguments">4.0.2. Arguments</h4>
<ul>
<li>[mapStateToProps(state, [ownProps]): stateProps] (Function): If specified, the component will subscribe to Redux store updates. Any time it updates, mapStateToProps will be called. Its result must be a plain object*, and it will be merged into the component’s props. If you omit it, the component will not be subscribed to the Redux store. If ownProps is specified as a second argument, its value will be the props passed to your component, and mapStateToProps will be additionally re-invoked whenever the component receives new props (e.g. if props received from a parent component have shallowly changed, and you use the ownProps argument, mapStateToProps is re-evaluated).</li>
<li>[mapDispatchToProps(dispatch, [ownProps]): dispatchProps] (Object or Function): If an object is passed, each function inside it will be assumed to be a Redux action creator. An object with the same function names, but with every action creator wrapped into a dispatch call so they may be invoked directly, will be merged into the component’s props. If a function is passed, it will be given dispatch. It’s up to you to return an object that somehow uses dispatch to bind action creators in your own way. (Tip: you may use the bindActionCreators() helper from Redux.) If you omit it, the default implementation just injects dispatch into your component’s props. If ownProps is specified as a second argument, its value will be the props passed to your component, and mapDispatchToProps will be re-invoked whenever the component receives new props.</li>
<li>[mergeProps(stateProps, dispatchProps, ownProps): props] (Function): If specified, it is passed the result of mapStateToProps(), mapDispatchToProps(), and the parent props. The plain object you return from it will be passed as props to the wrapped component. You may specify this function to select a slice of the state based on props, or to bind action creators to a particular variable from props. If you omit it, Object.assign({}, ownProps, stateProps, dispatchProps) is used by default.</li>
<li>[options] (Object) If specified, further customizes the behavior of the connector.<ul>
<li>[pure = true] (Boolean): If true, implements shouldComponentUpdate and shallowly compares the result of mergeProps, preventing unnecessary updates, assuming that the component is a “pure” component and does not rely on any input or state other than its props and the selected Redux store’s state. Defaults to true.</li>
<li>[withRef = false] (Boolean): If true, stores a ref to the wrapped component instance and makes it available via getWrappedInstance() method. Defaults to false.</li>
</ul>
</li>
</ul>
</blockquote>
<div id="anchors-navbar"><i class="fa fa-anchor"></i><ul><p><a href="#react-redux_之_connect_方法详解">react-redux 之 connect 方法详解</a></p><li><a href="#预备知识">1. 预备知识</a></li><li><a href="#使用_react-redux">2. 使用 react-redux</a></li><li><a href="#connect_详解">3. connect 详解</a></li><ul><li><a href="#mapStateToProps(state__ownProps)_:_stateProps">3.1. mapStateToProps(state, ownProps) : stateProps</a></li><li><a href="#mapDispatchToProps(dispatch__ownProps):_dispatchProps">3.2. mapDispatchToProps(dispatch, ownProps): dispatchProps</a></li><li><a href="#[mergeProps(stateProps__dispatchProps__ownProps):_props]">3.3. [mergeProps(stateProps, dispatchProps, ownProps): props]</a></li><li><a href="#其他">3.4. 其他</a></li></ul><li><a href="#附：connect_方法的官方英文文档">4. 附：connect 方法的官方英文文档</a></li><ul><li><a href="#">none</a></li><ul><li><a href="#connect([mapStateToProps]__[mapDispatchToProps]__[mergeProps]__[options])">4.0.1. connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])</a></li><li><a href="#Arguments">4.0.2. Arguments</a></li></ul></ul></ul></div><a href="#预备知识" id="goTop"><i class="fa fa-arrow-up"></i></a>
                                
</section>