#include <stdio.h>
#include <iostream>

int main()
{
  FILE *file;
  file = fopen("/dec.cpp", "w");
  std::cout << file;
  return 0;
}