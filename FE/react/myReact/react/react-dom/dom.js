export function setAttribute(dom, name, value) {
  // 如果属性名是class，则改回className
  if (name === 'className') name = 'class';

  // 如果属性名是onXXX，则是一个时间监听方法
  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
    // 如果属性名是style，则更新style对象
    // 我一般写React内联css都是以style={{"":"","":""}}这种风格写的,这也是React官方推荐的内联css写法
    //这里选择把上述格式的css转化为cssText复制给DOM节点的做法
    //关于cssText,这里有简单介绍 https://www.cnblogs.com/snandy/archive/2011/03/12/1980444.html
  } else if (name === 'style') {
    let domStyle = "";
    for (let i in value) {
      let styleValue = value[i];
      // 下面这个while循环负责把驼峰式的值改为标准的css属性值
      while (/[A-Z]/.test(i)) {
        i = i.replace(/[A-Z]/, function (char) {
          return "-" + char.toLowerCase();
        })
      }
      domStyle = domStyle + i + ":" + styleValue + ";";
      dom.style.cssText = domStyle; //把从style对象获得到的style给dom节点
    }
  }
  // 普通属性则直接更新属性
  else {
    if (name in dom) {
      dom[name] = value || '';
    }
    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name, value);
    }
  }
}