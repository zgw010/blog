const _ = require('./util')

function element(tageName, tafProps, children) {
  console.log(this instanceof element);
  if (!(this instanceof element)) {
    if (!_.isArray(children) && children != null) {
      children = _.slice(arguments, 2).filter(_.truthy)
    }
    return new Element(tagName, props, children)
  }
  // 没有传入 props 的情况
  if (_.isArray(props)) {
    children = props
    props = {}
  }
  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = props ?
    props.key :
    void 666
}

// export default element;
module.exports = {
  element
}