---
layout: post
title: "Unholy Grail: Duff's FizzBuzz"
---
I would like to describe the unholy grail of FizzBuzz: an implementation that uses Duff's Device.
[Gunnar Morling][gunnar-home] gave a good writeup about using SIMD in Java 16 to solve FizzBuzz.
[Mikael Kragbæk][mkr-gh] gave us the enterprise FizzBuzz.
I want to contribute to that glorious tradition and give the world Duff's FizzBuzz:

[gunnar-home]: https://www.morling.dev/blog/fizzbuzz-simd-style/
[mkr-gh]: https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition

```c
#include <stdio.h>

int main(void) {
    int limit = 100;

    int i = limit - (limit % 15);
    if (limit % 15 != 0) i += 15;
    switch (limit % 15) {
    case 0: do { printf("FizzBuzz\n");
    case 14: printf("%d\n", i-1);
    case 13: printf("%d\n", i-2);
    case 12: printf("Fizz\n");
    case 11: printf("%d\n", i-4);
    case 10: printf("Buzz\n");
    case 9: printf("Fizz\n");
    case 8: printf("%d\n", i-7);
    case 7: printf("%d\n", i-8);
    case 6: printf("Fizz\n");
    case 5: printf("Buzz\n");
    case 4: printf("%d\n", i-11);
    case 3: printf("Fizz\n");
    case 2: printf("%d\n", i-13);
    case 1: printf("%d\n", i-14);
        } while ((i -= 15) > 0);
    }

    return 0;
}
```

# Why?

Because I can and you can't stop me.
