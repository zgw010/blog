Label的作用是什么？是怎么用的？

label标签来定义表单控制间的关系,当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上。
  ```
  <label for="Name">Number:</label>
  <input type=“text“name="Name" id="Name"/>

  <label>Date:<input type="text" name="B"/></label>
  ```