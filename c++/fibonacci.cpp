#include <stdio.h>
#include <iostream>

int fibonacci(int n)
{
  int arr[1000];
  arr[0] = 1;
  arr[1] = 1;
  for (int i = 2; i <= n; i++)
  {
    arr[i] = arr[i - 1] + arr[i - 2];
  }
  return arr[n];
}

int main()
{
  int result = fibonacci(5);
  std::cout << result;
  return 0;
}