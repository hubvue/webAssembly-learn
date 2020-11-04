#include <stdio.h>
#include <iostream>

// 当在编译一段C++源代码时，由于C++天生支持“函数重载”的特定，需要使用“Name Mangling”机制来在最终生成的可执行文件中区别出源代码中定义的同名函数
// “Name Mangling”会在编译时对源码进行一定的转换，这样重载的同名函数就可以在可执行文件中被区分开。
// 一般的实现方式通常是将函数名所对应的实际函数签名以某种形式拼接在原有的函数名中
// 例如add函数，使用nm工具分析可执行文件就可以看出 三个重载的add函数被除了成了 __Z3addii __Z3addiii __Z3addiiii

// 解决办法是可以使用extern结构，extern的作用是强制以C语言的规范来编译作用域中的C++源代码，C中没有函数重载，所以就不会对函数名进行“Name Mangling”处理

// 0000000100000f30 T __Z3addii
// 0000000100000f10 T __Z3addiii
// 0000000100000ee0 T __Z3addiiii
//                  U __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEi
//                  U __ZNSt3__14coutE
// 0000000100002008 d __dyld_private
// 0000000100000000 T __mh_execute_header
// 0000000100000f50 T _main
//                  U dyld_stub_binder
//
extern "C"
{
  char add(int x, int y)
  {
    return 'H';
  }
}

int a;

extern char add(int x, int y, int z, int l)
{
  return 'H';
}

int main()
{
  int result = add(0, 1, 2, 3);
  std::cout << result;
  return 0;
}