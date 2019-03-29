# 堆（数据结构）

在计算机科学中，堆是一种专门的基于树的数据结构，它满足heap属性：if `P` 是父节点`C`，则key（值）`P` 大于或等于（在max堆中）或更少大于或等于（在一分钟内）的关键`C`。堆顶部的节点（没有父节点）称为根节点。

```js
// 堆
// 通常堆是通过一维数组来实现的。在数组起始位置为0的情形中：

// 父节点i的左子节点在位置 2i+1
// 父节点i的右子节点在位置 2i+2
// 子节点i的父节点在位置 floor((i-1)/2)

// 操作有:
// 最大堆调整（Max Heapify）：将堆的末端子节点作调整，使得子节点永远小于父节点
// 创建最大堆（Build Max Heap）：将堆中的所有数据重新排序
// 堆排序（HeapSort）：移除位在第一个数据的根节点，并做最大堆调整的递归运算
function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

function max_heapify_recursion(arr, start, end) {
  //建立父节点和子节点标记
  let dad = start;
  let son = dad * 2 + 1;
  if (son >= end) { //若子节点标记超过范围则退出函数
    return;
  }
  if (son + 1 < end && arr[son] < arr[son + 1]) //先比较两个子节点大小，选择最大的
    son++;
  if (arr[dad] <= arr[son]) { //如果父节点小于子节点时，交换父子内容,再继续子节点和孙节点比较
    swap(arr, dad, son);
    max_heapify_recursion(arr, son, end);
  }
}
function max_heapify_loop(arr, start, end) {
  for (let i = start * 2 + 1; i < end; i = i * 2 + 1) {
    if (i + 1 < end && arr[i] < arr[i + 1]) {
      ++i;
    }
    if (arr[start] <= arr[i]) {
      swap(arr, start, i);
      start = i;
    } else {
      break;
    }
  }
}
const heap_sort = function (arr) {
  let len = arr.length;
  //生成最大堆
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    max_heapify_loop(arr, i, len);
  }
  // 先将第一个元素和已排好元素前一位做交换，再重新调整，直到排序完毕,这一步完成排序
  for (let i = len - 1; i > 0; i--) {
    swap(arr, 0, i);
    max_heapify_loop(arr, 0, i);
  }
  return arr;
};

```