## Dijkstra算法

> Dijkstra 算法是一种计算从单个源到其他所有源的最短路径的贪心算法.

> https://blog.csdn.net/qq_35644234/article/details/60870719

### 定义概览

Dijkstra(迪杰斯特拉)算法是典型的单源最短路径算法，用于计算一个节点到其他所有节点的最短路径。主要特点是以起始点为中心向外层层扩展，直到扩展到终点为止。Dijkstra算法是很有代表性的最短路径算法，在很多专业课程中都作为基本内容有详细的介绍，如数据结构，图论，运筹学等等。注意该算法要求图中不存在负权边。

问题描述：在无向图 G=(V,E) 中，假设每条边 E[i] 的长度为 w[i]，找到由顶点 V0 到其余各点的最短路径。（单源最短路径）

 

### 算法描述

算法思想：设G=(V,E)是一个带权有向图，把图中顶点集合V分成两组，第一组为已求出最短路径的顶点集合（用S表示，初始时S中只有一个源点，以后每求得一条最短路径 , 就将加入到集合S中，直到全部顶点都加入到S中，算法就结束了），第二组为其余未确定最短路径的顶点集合（用U表示），按最短路径长度的递增次序依次把第二组的顶点加入S中。在加入的过程中，总保持从源点v到S中各顶点的最短路径长度不大于从源点v到U中任何顶点的最短路径长度。此外，每个顶点对应一个距离，S中的顶点的距离就是从v到此顶点的最短路径长度，U中的顶点的距离，是从v到此顶点只包括S中的顶点为中间顶点的当前最短路径长度。

1. 初始时，S只包含起点s；U包含除s外的其他顶点，且U中顶点的距离为"起点s到该顶点的距离"[例如，U中顶点v的距离为(s,v)的长度，然后s和v不相邻，则v的距离为∞]。

2. 从U中选出"距离最短的顶点k"，并将顶点k加入到S中；同时，从U中移除顶点k。

3. 更新U中各个顶点到起点s的距离。之所以更新U中顶点的距离，是由于上一步中确定了k是求出最短路径的顶点，从而可以利用k来更新其它顶点的距离；例如，(s,v)的距离可能大于(s,k)+(k,v)的距离。

4. 重复步骤(2)和(3)，直到遍历完所有顶点。


### 例题

[HDOJ 畅通工程续](http://acm.hdu.edu.cn/showproblem.php?pid=1874)

```c++
#include <bits/stdc++.h>
using namespace std;

int g[1005][1005];
int dist[205];
bool visit[205]; // 用来标记是否是已经找到的有最短路径的点
typedef pair<int, int> p;

void dijkstra(int s, int n)
{
  dist[s] = 0;
  priority_queue<p, vector<p>, greater<p>> pq;
  pq.push(p(0, s));
  while (!pq.empty())
  {
    p t = pq.top();
    pq.pop();
    int vi = t.second;
    if (visit[vi])
    {
      continue;
    }
    visit[vi] = true;
    for (int i = 0; i < n; i++)
    {
      if (!visit[i] && dist[i] > dist[vi] + g[i][vi])
      {
        dist[i] = dist[vi] + g[i][vi];
        pq.push(p(dist[i], i));
      }
    }
  }
  return;
}

int main()
{
  int n, m, a, b, x, S, T;
  while (cin >> n >> m)
  {
    for (int i = 0; i < n; i++)
      for (int j = 0; j < n; j++)
        g[i][j] = 10000;
    for (int i = 0; i < n; i++)
    {
      g[i][i] = 0;
      dist[i] = 10000;
      visit[i] = false;
    }
    for (int i = 0; i < m; i++)
    {
      cin >> a >> b >> x;
      if (x < g[a][b]) { g[a][b] = g[b][a] = x; }
    }
    cin >> S >> T;
    dijkstra(S, n);
    if (dist[T] != 10000) cout << dist[T] << endl;
    else cout << "-1" << endl;
  }
  return 0;
}
```

[c++ 优先队列的重载操作](https://blog.csdn.net/c20182030/article/details/70757660)