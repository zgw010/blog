__对理解这个问题很有帮助的两点__

1. 计算某个字符对应的 next 值，就是看这个字符之前的字符串中有多大长度的相同前缀后缀
2. ![](https://raw.githubusercontent.com/zgw0/blog/master/imgs/kmp_next.png)

```js
// 基本原理: http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html
// 清晰的解释: https://www.zhihu.com/question/21923021/answer/281346746
// 非常具体的解释: https://blog.csdn.net/v_july_v/article/details/7041827

const kmp = function (s1, s2) {
  let next = [-1],
    i = 0,
    j = 0;
  for (let val = -1, index = 0; index < s2.length;) {
    if (val === -1 || s2[index] === s2[val]) {
      ++index;
      ++val;
      next[index] = val;
    } else {
      val = next[val];
    }
  }
  while (i < s1.length && j < s2.length) {
    if (j === -1 || s1[i] === s2[j]) {
      i++;
      j++;
    } else {
      j = next[j];
    }

  }
  if (j === s2.length)
    return i - j;
  else
    return -1;
}
```