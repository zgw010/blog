## 定义

> 最长公共子序列（LCS）是一个在一个序列集合中（通常为两个序列）用来查找所有序列中最长子序列的问题。这与查找最长公共子串的问题不同的地方是：子序列不需要在原序列中占用连续的位置 。最长公共子序列问题是一个经典的计算机科学问题，也是数据比较程序，比如Diff工具，和生物信息学应用的基础。它也被广泛地应用在版本控制，比如Git用来调和文件之间的改变。  

## 解法

![](https://raw.githubusercontent.com/zgw0/blog/master/imgs/lcs.png)

> 这里有篇很好的博客: https://www.kancloud.cn/digest/pieces-algorithm/163624

下面是这个算法的核心部分

```
if X[i] = Y[j]
    C[i,j] := C[i-1,j-1] + 1
else
    C[i,j] := max(C[i,j-1], C[i-1,j])
```


## 代码部分

这部分实现了寻找最长公共子序列和最短公共父序列两个算法

```c++
#include <iostream>
#include <string>
#include <vector>
using namespace std;
vector<vector<int>> LCS_helper(const string &str1, const string &str2)
{
	int i, j;
	vector<vector<int>> dp(str1.length() + 1, vector<int>(str2.length() + 1));
	if (str1 == "" || str2 == "")
		return dp;
	for (i = 1; i <= str1.length(); i++)
	{
		for (j = 1; j <= str2.length(); j++)
		{
			if (str1[i - 1] == str2[j - 1])
			{
				dp[i][j] = dp[i - 1][j - 1] + 1;
			}
			else
			{
				if (dp[i - 1][j] >= dp[i][j - 1])
				{
					dp[i][j] = dp[i - 1][j];
				}
				else
				{
					dp[i][j] = dp[i][j - 1];
				}
			}
		}
	}
	return dp;
}
string getLCS(string str1, string str2, vector<vector<int>> dp)
{
	string lcs;
	int i = str1.length(), j = str2.length();
	while (i > 0 && j > 0)
	{
		if (str1[i - 1] == str2[j - 1])
		{
			lcs = str1[i - 1] + lcs;
			--i;
			--j;
		}
		else
		{
			if (dp[i - 1][j] >= dp[i][j - 1])
				--i;
			else
				--j;
		}
	}
	return lcs;
}
string getLCSS(string str1, string str2, vector<vector<int>> dp)
{
	string lcss;
	int i = str1.length(), j = str2.length();
	while (i > 0 && j > 0)
	{
		if (str1[i - 1] == str2[j - 1])
		{
			lcss = str1[i - 1] + lcss;
			--i;
			--j;
		}
		else
		{
			if (dp[i - 1][j] >= dp[i][j - 1])
			{
				lcss = str1[i - 1] + lcss;
				--i;
			}
			else
			{
				lcss = str1[j - 1] + lcss;
				--j;
			}
		}
	}
	if(i>0)lcss = str1.substr(0,i) + lcss;
	if(j>0)lcss = str2.substr(0,j) + lcss;
	return lcss;
}

int main(void)
{
	string str1 = "abac", str2 = "cab";
	vector<vector<int>> d = LCS_helper(str1, str2);
	cout << getLCSS(str1, str2, d) << endl;
	return 0;
}
```