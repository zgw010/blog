在解决回文字符串问题的时候遇到的这个算法

> 首先通过在每个字符的两边都插入一个特殊的符号，将所有可能的奇数或偶数长度的回文子串都转换成了奇数长度。比如 abba 变成 #a#b#b#a#， aba变成 #a#b#a#。
> 此外，为了进一步减少编码的复杂度，可以在字符串的开始加入另一个特殊字符，这样就不用特殊处理越界问题，比如$#a#b#a#。

数组 Ma 代表加了 # 以后的字符串

数组 Mp 代表 以字符串第 i 位为中心的回文串的最大半径

mx 代表当前 **已经匹配完毕的结尾最远的回文串** 到达了 Ma 数组的第 mx 位

id 代表当前 **已经匹配完毕的结尾最远的回文串** 中心为 Ma 数组的第 id 位

 -- # 1 # 2 # 2 # 1 # 2 # 3 # 2 # 1 # // Ma[]
 
 -- 1 2 1 2 5 2 1 4 1 2 1 6 1 2 1 2 1 // Mp[]

**Mp[i] - 1** 就是最后的答案
```js
let mx = 0, id = 0;
for (let i = 0; i < len; ++i) { // i代表了当前正在判断Ma串的第i位为中心的回文子串最长长度。
  Mp[i] = mx > i ? Math.min(Mp[2 * id - 1], mx - i) : 1 // 核心代码
  while (Ma[i + Mp[i]] === Ma[i - Mp[i]]) {
    ++Mp[i];
  }
  if (mx < i + Mp[i]) {
    mx = i + Mp[i];
    id = i;
  }
}
```
代码的解释知乎有很好的回答, 但是要补充一点, 也是很关键的一点
> p[j]+i没有超过m，那么p[i]=p[j]+i。

原因: 对于c为中心的回文串, str[m' ~ c]和str[m ~ c]是一样的, 对于以j为中心的字符串str[p[j] ~ j]和str[p[j] ~ j] 是一样的, 所以对于以i为中心的字符串str[p[i] ~ i]和str[p[i] ~ i] 是一样的, 然后就能很轻易的得出最终的结论了.

作者：C加加编程思想
链接：https://www.zhihu.com/question/37289584/answer/370848679
来源：知乎

如果要求p[i]，那么我们一定已经知道了小于i的所有值（也就是说如果j < i，那么p[j]一定知道了，并且是个不会再变的值），而且，还要利用之前的p[j]去求p[i]。那么如何设计这个算法呢？你必须首先知道如何用p[j]来求p[i]（从0到i的这i个j，哪个是要用的）。
我们用图片说明他们的关系：

<img src="https://pic4.zhimg.com/v2-f4f59c25e384d6ce2607dc6c1757f9d7_b.jpg" data-caption="" data-size="normal" data-rawwidth="715" data-rawheight="354" class="origin_image zh-lightbox-thumb" width="715" data-original="https://pic4.zhimg.com/v2-f4f59c25e384d6ce2607dc6c1757f9d7_r.jpg">

解释一下i是目前要求的中心的位置，我们要求p[i]。

m是从p[0]+0到p[i-1]+i-1这i个值中最大的那个，它可以在i左边，也可以在i右边，并不确定。

c是m对应的位置，p[c]+c=m。

j和i关于c对称。按照之前的假设，p[j] p[c] m 这三个值都已知了，都是在计算小于i的所有情况时保存的。

下面就是核心逻辑，如果m在i左边，那没什么好说的，用expand from center的方法，以i为中心，向两边扩展，得到p[i]。这里不需要之前的值。

那么如果m在i右边呢？ 显然以c为中心的回文串包括了i位置。注意，以i为中心的回文串，和以j为中心的回文串存在着关联。p[j]为以j为中心的回文串的一半的长度。如果p[j]+i没有超过m，那么p[i]=p[j]+i。

<img src="https://pic3.zhimg.com/v2-f9f4e073dbb5d3cf07f3ab975365b602_b.jpg" data-caption="" data-size="normal" data-rawwidth="696" data-rawheight="354" class="origin_image zh-lightbox-thumb" width="696" data-original="https://pic3.zhimg.com/v2-f9f4e073dbb5d3cf07f3ab975365b602_r.jpg">

如果p[j]+i超过m，那么只能确定p[i]至少有m-i这么长，之后的字符超过了p[c]的范围（m'左边的和m右边的不对称），需要重新检查。所以p[i]的值要么是m-i要么是p[j]，哪个小取哪个。而j=2*c-i