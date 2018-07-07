function render(element, parentDom) {
  const {
    type,
    props
  } = element;
  const dom = document.createElement(type);
  const isListener = name => name.startsWith('on'); //判断name是否以on开头

  //处理事件监听器
  Object.key(props).filter(isListener).forEach(event => {
    const eventType = name.toLowerCase().slice(2);
    dom.addEventListener(eventTypr, props[name]);
  })

  //不是监听事件,不是children 则赋值为下一个dom
  const isAttribute = name => !isListener(name) && name !== "children";
  Object.key(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  })

  //过滤出来的属性,添加到dom
  const childrenElements = props.children || [];
  childrenElements.forEach(element => render(element, dom));

  parentDom.appendChild(dom);
}