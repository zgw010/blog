**栈**（stack），是[计算机科学](https://zh.wikipedia.org/wiki/%E8%A8%88%E7%AE%97%E6%A9%9F%E7%A7%91%E5%AD%B8)中一种特殊的串列形式的[抽象数据类型](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%B3%87%E6%96%99%E5%9E%8B%E5%88%A5)，其特殊之处在于只能允许在[链表](https://zh.wikipedia.org/wiki/%E9%80%A3%E7%B5%90%E4%B8%B2%E5%88%97)或[数组](https://zh.wikipedia.org/wiki/%E9%99%A3%E5%88%97)的一端（称为堆栈顶端指针，英语：top）进行加入数据（英语：push）和输出数据（英语：pop）的运算。另外栈也可以用一维[数组](https://zh.wikipedia.org/wiki/%E9%99%A3%E5%88%97)或[链表](https://zh.wikipedia.org/wiki/%E9%80%A3%E7%B5%90%E4%B8%B2%E5%88%97)的形式来完成。堆栈的另外一个相对的操作方式称为[队列](https://zh.wikipedia.org/wiki/%E4%BD%87%E5%88%97)。

由于堆栈数据结构只允许在一端进行操作，因而按照后进先出（LIFO, Last In First Out）的原理运作。

![1527303540928](/tmp/1527303540928.png)

堆栈数据结构使用两种基本操作：推入（压栈，push）和弹出（弹栈，pop）：

- 推入：将数据放入堆栈的顶端（数组形式或串列形式），堆栈顶端top指针加一。
- 弹出：将顶端数据数据输出（回传），堆栈顶端数据减一。

栈的基本特点：

1. 先入后出，后入先出。
2. 除头尾节点之外，每个元素有一个前驱，一个后继。