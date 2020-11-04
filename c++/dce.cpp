#include <stdio.h>
#include <iostream>

// DCE 死代码消除
// DCE是可以将源代码中没有用使用到的代码从最后的目标产物中移除，以便优化其最终大小及执行效率
// C++上的DCE更进一步，它消除的是那些对程序最后运行接口没有任何影响的代码，而不仅仅是没有用到的代码。
int main()
{
  int a = 24;
  int b = 25;
  int c;
  c = a << 2;
  return c;
  b = 24;
  return 0;
}