**队列**，(queue)，是[先进先出](https://zh.wikipedia.org/wiki/%E5%85%88%E9%80%B2%E5%85%88%E5%87%BA)（FIFO, First-In-First-Out）的[线性表](https://zh.wikipedia.org/wiki/%E7%BA%BF%E6%80%A7%E8%A1%A8)。在具体应用中通常用[链表](https://zh.wikipedia.org/wiki/%E9%93%BE%E8%A1%A8)或者[数组](https://zh.wikipedia.org/wiki/%E6%95%B0%E7%BB%84)来实现。队列只允许在后端（称为*rear*）进行插入操作，在前端（称为*front*）进行删除操作。

队列的操作方式和[堆栈](https://zh.wikipedia.org/wiki/%E5%A0%86%E6%A0%88)类似，唯一的区别在于队列只允许新数据在后端进行添加。

![1527303244993](/tmp/1527303244993.png)

### 单链队列

单链队列使用链表作为基本数据结果，所以不存在伪溢出的问题，队列长度也没有限制。但插入和读取的时间代价较高

### 循环队列

循环队列可以更简单防止伪溢出的发生，但队列大小是固定的。