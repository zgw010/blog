## 定义

> 最长公共子序列（LCS）是一个在一个序列集合中（通常为两个序列）用来查找所有序列中最长子序列的问题。这与查找最长公共子串的问题不同的地方是：子序列不需要在原序列中占用连续的位置 。最长公共子序列问题是一个经典的计算机科学问题，也是数据比较程序，比如Diff工具，和生物信息学应用的基础。它也被广泛地应用在版本控制，比如Git用来调和文件之间的改变。  

## 解法

最长公共子序列问题存在最优子结构：这个问题可以分解成更小，更简单的“子问题”，这个子问题可以分成更多的子问题，因此整个问题就变得简单了。最长公共子序列问题的子问题的解是可以重复使用的，也就是说，更高级别的子问题通常会重用低级子问题的解。拥有这个两个属性的问题可以使用动态规划算法来解决，这样子问题的解就可以被储存起来，而不用重复计算。这个过程需要在一个表中储存同一级别的子问题的解，因此这个解可以被更高级的子问题使用。

动态规划的一个计算最长公共子序列的方法如下，以两个序列 $\displaystyle X$ 、$\displaystyle Y$ 为例子：

设有二维数组 $\displaystyle f[i][j]$ 表示 $\displaystyle X$ 的  $\displaystyle i$ 位和 $\displaystyle Y$ 的 $\displaystyle j$ 位之前的最长公共子序列的长度，则有：

$\displaystyle f[1][1]=same(1,1)$

$\displaystyle f[i][j]=max\{f[i-1][j-1]+same(i,j),f[i-1][j],f[i][j-1]\}$

其中，$\displaystyle same(a,b)$ 当 $\displaystyle X$ 的第 $\displaystyle a$ 位与 $\displaystyle Y$ 的第 $\displaystyle b$ 位完全相同时为“1”，否则为“0”。

此时，$\displaystyle f[i][j]$ 中最大的数便是 $\displaystyle X$ 和 $\displaystyle Y$ 的最长公共子序列的长度，依据该数组回溯，便可找出最长公共子序列。

该算法的空间、时间复杂度均为 $\displaystyle O(n^2)$ ，经过优化后，空间复杂度可为$\displaystyle O(n)$。