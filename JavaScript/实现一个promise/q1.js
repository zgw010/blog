const defer = function () {
  let pending = [],
    value;
  return {
    resolve: function (_value) {
      // 只能 resolve 一次
      if (pending) {
        const value = _value;
        for (let i = 0, ii = pending.length; i < ii; ++i) {
          let cb = pending[i];
          cb(value);
        }
        padding = undefined;
      } else {
        throw new Error("A promise can only be resolved once.")
      }
    },
    then: function (cb) {
      if (pending) {
        pending.push(cb);
      } else {
        cb(value)
      }
    }
  }
}
const ref = function (value) {
  if (isPromise(value)) {
    return value;
  } else {
    return {
      then: function (cb) {
        return ref(cb(value));
      }
    }
  }
}