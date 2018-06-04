![1527303777399](/tmp/1527303777399.png)

![img](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Hash_table_3_1_1_0_1_0_0_SP.svg/315px-Hash_table_3_1_1_0_1_0_0_SP.svg.png)

一个小电话簿作为散列表

在[计算中](https://en.wikipedia.org/wiki/Computing)，**散列表**（**哈希映射**）是一种实现[关联数组](https://en.wikipedia.org/wiki/Associative_array)[抽象数据类型](https://en.wikipedia.org/wiki/Abstract_data_type)的[数据结构](https://en.wikipedia.org/wiki/Data_structure)，这种结构可以将[键](https://en.wikipedia.org/wiki/Unique_key)映射到[值](https://en.wikipedia.org/wiki/Value_(computer_science))。哈希表使用[哈希函数](https://en.wikipedia.org/wiki/Hash_function)来计算*索引*到一个*桶*或*槽*的阵列中，从中可以找到所需的值。

理想情况下，散列函数会将每个键分配给一个独特的桶，但是大多数散列表设计使用了不完美的散列函数，这可能会导致散列*冲突*，其中散列函数为多个键生成相同的索引。必须以某种方式解决这种冲突。

在尺寸合理的哈希表中，每次查找的平均成本（[指令](https://en.wikipedia.org/wiki/Instruction_(computer_science))数量）与存储在表中的元素数量无关。许多散列表设计还允许以每次操作的（[摊销](https://en.wikipedia.org/wiki/Amortized_analysis)[[2\]](https://en.wikipedia.org/wiki/Hash_table#cite_note-leiser-2)）恒定平均成本任意插入和删除键值对。[[3\] ](https://en.wikipedia.org/wiki/Hash_table#cite_note-knuth-3)[[4\]](https://en.wikipedia.org/wiki/Hash_table#cite_note-cormen-4)

在许多情况下，散列表结果平均来说比[搜索树](https://en.wikipedia.org/wiki/Search_tree)或任何其他[表](https://en.wikipedia.org/wiki/Table_(computing))查找结构更高效。由于这个原因，它们被广泛用于多种计算机[软件中](https://en.wikipedia.org/wiki/Software)，特别是关联数组，[数据库索引](https://en.wikipedia.org/wiki/Database_index)，[缓存](https://en.wikipedia.org/wiki/Cache_(computing))和[集合](https://en.wikipedia.org/wiki/Set_(abstract_data_type))。

### 基本概念

- 若关键字为{\displaystyle k}![k](https://wikimedia.org/api/rest_v1/media/math/render/svg/c3c9a2c7b599b37105512c5d570edc034056dd40)，则其值存放在{\displaystyle f(k)}![f(k)](https://wikimedia.org/api/rest_v1/media/math/render/svg/c36f16f5357aeb5b0fa2fe3040e74282d62f8881)的存储位置上。由此，不需比较便可直接取得所查记录。称这个对应关系{\displaystyle f}![f](https://wikimedia.org/api/rest_v1/media/math/render/svg/132e57acb643253e7810ee9702d9581f159a1c61)为[散列函数](https://zh.wikipedia.org/wiki/%E6%95%A3%E5%88%97%E5%87%BD%E6%95%B0)，按这个思想建立的表为**散列表**。

- 对不同的关键字可能得到同一散列地址，即{\displaystyle k_{1}\neq k_{2}}![k_{1}\neq k_{2}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f2b910a452063a4769272110d8d22cab053d433d)，而{\displaystyle f(k_{1})=f(k_{2})}![f(k_{1})=f(k_{2})](https://wikimedia.org/api/rest_v1/media/math/render/svg/fa1d43b27a17bf57baf12626ad7cfbf8ee9bb96d)，这种现象称为**冲突**（英语：Collision）。具有相同函数值的关键字对该散列函数来说称做**同义词**。综上所述，根据散列函数{\displaystyle f(k)}![f(k)](https://wikimedia.org/api/rest_v1/media/math/render/svg/c36f16f5357aeb5b0fa2fe3040e74282d62f8881)和处理冲突的方法将一组关键字映射到一个有限的连续的地址集（区间）上，并以关键字在地址集中的“[像](https://zh.wikipedia.org/wiki/%E5%83%8F_(%E6%95%B8%E5%AD%B8))”作为记录在表中的存储位置，这种表便称为**散列表**，这一映射过程称为[散列造表](https://zh.wikipedia.org/wiki/%E6%95%A3%E5%88%97)或[散列](https://zh.wikipedia.org/wiki/%E6%95%A3%E5%88%97)，所得的存储位置称[散列地址](https://zh.wikipedia.org/w/index.php?title=%E6%95%A3%E5%88%97%E5%9C%B0%E5%9D%80&action=edit&redlink=1)。

- 若对于关键字集合中的任一个关键字，经散列函数映象到地址集合中任何一个地址的概率是相等的，则称此类散列函数为[均匀散列函数](https://zh.wikipedia.org/w/index.php?title=%E5%9D%87%E5%8C%80%E6%95%A3%E5%88%97%E5%87%BD%E6%95%B0&action=edit&redlink=1)（Uniform Hash function），这就是使关键字经过散列函数得到一个“随机的地址”，从而减少冲突。

## 构造散列函数

散列函数能使对一个数据序列的访问过程更加迅速有效，通过散列函数，数据元素将被更快定位。

1. [直接定址法](https://zh.wikipedia.org/w/index.php?title=%E7%9B%B4%E6%8E%A5%E5%AE%9A%E5%9D%80%E6%B3%95&action=edit&redlink=1)：取关键字或关键字的某个线性函数值为散列地址。即{\displaystyle hash(k)=k}![hash(k)=k](https://wikimedia.org/api/rest_v1/media/math/render/svg/92632e59ab25c8f6d526ea9fb9cf4e014912afe3)或{\displaystyle hash(k)=a\cdot k+b}![hash(k)=a\cdot k+b](https://wikimedia.org/api/rest_v1/media/math/render/svg/989ebc7db55ece5d29e2a8baa005e876ef486e4e)，其中{\displaystyle a\,b}![a\,b](https://wikimedia.org/api/rest_v1/media/math/render/svg/c05a31dfe5e0968f155a73d46d6fbb44d412960e)为常数（这种散列函数叫做自身函数）
2. [数字分析法](https://zh.wikipedia.org/w/index.php?title=%E6%95%B0%E5%AD%97%E5%88%86%E6%9E%90%E6%B3%95&action=edit&redlink=1)：假设关键字是以*r*为基的数，并且哈希表中可能出现的关键字都是事先知道的，则可取关键字的若干数位组成哈希地址。
3. [平方取中法](https://zh.wikipedia.org/wiki/%E5%B9%B3%E6%96%B9%E5%8F%96%E4%B8%AD%E6%B3%95)：取关键字平方后的中间几位为哈希地址。通常在选定哈希函数时不一定能知道关键字的全部情况，取其中的哪几位也不一定合适，而一个数平方后的中间几位数和数的每一位都相关，由此使随机分布的关键字得到的哈希地址也是随机的。取的位数由表长决定。
4. [折叠法](https://zh.wikipedia.org/w/index.php?title=%E6%8A%98%E5%8F%A0%E6%B3%95&action=edit&redlink=1)：将关键字分割成位数相同的几部分（最后一部分的位数可以不同），然后取这几部分的叠加和（舍去进位）作为哈希地址。
5. [随机数法](https://zh.wikipedia.org/w/index.php?title=%E9%9A%8F%E6%9C%BA%E6%95%B0%E6%B3%95&action=edit&redlink=1)
6. [除留余数法](https://zh.wikipedia.org/w/index.php?title=%E9%99%A4%E7%95%99%E4%BD%99%E6%95%B0%E6%B3%95&action=edit&redlink=1)：取关键字被某个不大于散列表表长m的数p除后所得的余数为散列地址。即{\displaystyle hash(k)=k\,{\bmod {\,}}p}![hash(k)=k\,{\bmod  \,}p](https://wikimedia.org/api/rest_v1/media/math/render/svg/bc04a0c2f72156976761fa24dd4ba098855b7dca), {\displaystyle p\leq m}![p\leq m](https://wikimedia.org/api/rest_v1/media/math/render/svg/3aad2b022083cbc8aef0745526f3a448e7d96160)。不仅可以对关键字直接取模，也可在[折叠法](https://zh.wikipedia.org/w/index.php?title=%E6%8A%98%E5%8F%A0%E6%B3%95&action=edit&redlink=1)、[平方取中法](https://zh.wikipedia.org/wiki/%E5%B9%B3%E6%96%B9%E5%8F%96%E4%B8%AD%E6%B3%95)等运算之后取模。对p的选择很重要，一般取素数或m，若p选择不好，容易产生冲突。

## 处理冲突

为了知道冲突产生的相同散列函数地址所对应的关键字，必须选用另外的散列函数，或者对冲突结果进行处理。而不发生冲突的可能性是非常之小的，所以通常对冲突进行处理。常用方法有以下几种：

- [开放定址法](https://zh.wikipedia.org/w/index.php?title=%E5%BC%80%E6%94%BE%E5%AE%9A%E5%9D%80%E6%B3%95&action=edit&redlink=1)（open addressing）：{\displaystyle hash_{i}=(hash(key)+d_{i})\,{\bmod {\,}}m}![hash_{i}=(hash(key)+d_{i})\,{\bmod  \,}m](https://wikimedia.org/api/rest_v1/media/math/render/svg/e9f569136022671abb3e623da1828b31313fd254), {\displaystyle i=1,2...k\,(k\leq m-1)}![i=1,2...k\,(k\leq m-1)](https://wikimedia.org/api/rest_v1/media/math/render/svg/0058c0d7ccf20ae3e766d134568c70a2825da6f5)，其中{\displaystyle hash(key)}![hash(key)](https://wikimedia.org/api/rest_v1/media/math/render/svg/b18811f21bf174d2e231ea20355d09b694a8f0bb)为散列函数，{\displaystyle m}![m](https://wikimedia.org/api/rest_v1/media/math/render/svg/0a07d98bb302f3856cbabc47b2b9016692e3f7bc)为散列表长，{\displaystyle d_{i}}![d_{i}](https://wikimedia.org/api/rest_v1/media/math/render/svg/abe3154db7d4f92fb42dd1f80f52f528c6312e4a)为增量序列，{\displaystyle i}![i](https://wikimedia.org/api/rest_v1/media/math/render/svg/add78d8608ad86e54951b8c8bd6c8d8416533d20)为已发生冲突的次数。增量序列可有下列取法：


显示**线性探测**填装一个散列表的过程：


| 散列地址 | 空表 | 插入89 | 插入18 | 插入49 | 插入58 | 插入69 |
| -------- | ---- | ------ | ------ | ------ | ------ | ------ |
| 0        |      |        |        | 49     | 49     | 49     |
| 1        |      |        |        |        | 58     | 58     |
| 2        |      |        |        |        |        | 69     |
| 3        |      |        |        |        |        |        |
| 4        |      |        |        |        |        |        |
| 5        |      |        |        |        |        |        |
| 6        |      |        |        |        |        |        |
| 7        |      |        |        |        |        |        |
| 8        |      |        | 18     | 18     | 18     | 18     |
| 9        |      | 89     | 89     | 89     | 89     | 89     |


[聚集](https://zh.wikipedia.org/wiki/%E8%81%9A%E9%9B%86)（Cluster，也翻译做“堆积”）的意思是，在函数地址的表中，散列函数的结果不均匀地占据表的单元，形成区块，造成线性探测产生一次聚集（primary clustering）和平方探测的二次聚集（secondary clustering），散列到区块中的任何关键字需要查找多次试选单元才能插入表中，解决冲突，造成时间浪费。对于开放定址法，聚集会造成性能的灾难性损失，是必须避免的。

- [单独链表法](https://zh.wikipedia.org/w/index.php?title=%E5%8D%95%E7%8B%AC%E9%93%BE%E8%A1%A8%E6%B3%95&action=edit&redlink=1)：将散列到同一个存储位置的所有元素保存在一个链表中。实现时，一种策略是散列表同一位置的所有冲突结果都是用[栈](https://zh.wikipedia.org/wiki/%E6%A0%88)存放的，新元素被插入到表的前端还是后端完全取决于怎样方便。

- [双散列](https://zh.wikipedia.org/w/index.php?title=%E5%8F%8C%E6%95%A3%E5%88%97&action=edit&redlink=1)。

- [再散列](https://zh.wikipedia.org/w/index.php?title=%E5%86%8D%E6%95%A3%E5%88%97&action=edit&redlink=1)：{\displaystyle hash_{i}=hash_{i}(key)}![hash_{i}=hash_{i}(key)](https://wikimedia.org/api/rest_v1/media/math/render/svg/f134a19206b07cf80819456a4e6cdbc8d0b21094), {\displaystyle i=1,2...k}![i=1,2...k](https://wikimedia.org/api/rest_v1/media/math/render/svg/9262abfaf2d4cd11525525470afa10c6f278cf96)。{\displaystyle hash_{i}}![hash_{i}](https://wikimedia.org/api/rest_v1/media/math/render/svg/737c8d1775237fdfda89193adb9050394687b026)是一些散列函数。即在上次散列计算发生冲突时，利用该次冲突的散列函数地址产生新的散列函数地址，直到冲突不再发生。这种方法不易产生“[聚集](https://zh.wikipedia.org/wiki/%E8%81%9A%E9%9B%86)”（Cluster），但增加了计算时间。

- 建立一个公共溢出区