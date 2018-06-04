#### k-近邻算法概述

在一个 10 * 10 的二维平面内画一条线把它分成 2 个区域(A/B)。假设我们不知道线是如何画的，但现已知有 4 个点，a 点坐标是 (1, 1) 属于区域 A，b 点坐标是 (2, 2) 属于区域 A，c 点坐标是 (9, 9) 属于区域 B，d 点坐标是 (8, 8) 属于区域 B。这时候再给定一个 e 点坐标是 (8.5, 8.5) ，请问它最有可能在哪个区域内？

| Index | Point 1 | Point 2 | Area  |
| ----- | ------- | ------- | ----- |
| a     | 1       | 1       | A     |
| b     | 2       | 2       | A     |
| c     | 9       | 9       | B     |
| d     | 8       | 8       | B     |
| e     | 8.5     | 8.5     | **?** |

![二维平面图示例](https://img.alicdn.com/tfs/TB1tqEzd5qAXuNjy1XdXXaYcVXa-1280-960.png)

绝大多数人都会说“可能是 B”。我们是如何得出这个答案的？——因为它和 c, d “看起来更接近一些，更有可能在同一个区域”。同样的推论可以延伸至三维、四维甚至更多维度的数据中。MNIST 的数据表示就是 728 个特征的多纬数据，k-近邻算法同样适用。

> 存在一个训练样本集，并且样本集中每个数据都存在标签，即我们知道样本集中每一数据与所属分类的对应关系。输入没有标签的新数据后，将新数据的每个特征与样本集中数据对应的特征进行比较，然后算法提取样本特征最近邻的分类标签。一般来说，我们只选择样本数据集中前 k 个最相似的数据，这就是 k-近邻算法的 k 的出处。
> ——《机器学习实战》k 近邻算法

两个向量之间的距离可以通过欧几里得距离公式求得：

![欧几里得距离公式](https://img.alicdn.com/tfs/TB12gMzd5qAXuNjy1XdXXaYcVXa-1096-126.png)

于是实现一个 k-NN 算法就很简单了：

```
function classify(x, trainingData, labels, k) {

  // 确定目标点 x 与训练数据中每个点的距离（欧几里得距离公式）
  const distances =[];
  trainingData.forEach(element => {
    let distance = 0;
    element.forEach((value, index) => {
      const diff = x[index] - value;
      distance += (diff * diff);
    });
    distances.push(Math.sqrt(distance));
  });

  // 将训练数据按照与 x 点的距离从近到远排序
  const sortedDistIndicies = distances
    .map((value, index) => {
      return {value, index};
    })
    .sort((a, b) => a.value - b.value );

  // 确定前 k 个点类别的出现频率
  const classCount = {};
  for (let i = 0; k > i; i++) {
    const voteLabel = labels[sortedDistIndicies[i].index];
    classCount[voteLabel] = (classCount[voteLabel] || 0) + 1;
  }

  // 返回出现频率最高的类别作为当前点的预测分类
  let predictedClass = '';
  let topCount = 0;
  for (const voteLabel in classCount) {
    if (classCount[voteLabel] > topCount) {
      predictedClass = voteLabel;
      topCount = classCount[voteLabel];
    }
  }

  return predictedClass;
}
```