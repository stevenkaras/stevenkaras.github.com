---
title: Java Generics
layout: post
---
In my latest Java project, I've found that I need to create some fairly complex data routing. The idea is that I have a variety of processes that I want to apply to a set of data. But I've been running into problems that recur throughout the design of the project. What I've realized is that I've been fighting against the language. Things such as typing, etc. In general, when this happens, I view it as a sign that I need to both rethink my design and also consider switching to another language that has a different paradigm (typically one that solves the conflict).Unfortunately, I'm somewhat tied to Java for reasons beyond my control.

One of the big problems in Java is that primitive types are not first order class objects. To some extent, this problem has a workaround: autoboxing. Autoboxing is the process where a primitive type and its respective class (e.g. int and Integer) are interchangeable. Which means that most of the time, you won't need to worry about type-safety with these objects. Almost.

While autoboxing bridges the gap in the majority of cases, one particular situation arises more than others. Arrays of primitives are not type-compatible with arrays of objects. Regardless of whether the object type is normally autoboxed for the primitive, the types `int[]` is not equivalent to `Integer[]`.

This normally would have much of an impact on my programming, but when combined with the need to use variable size containers, and then return arrays, leads to a mess of code that comes close to breaking type-safety. The root cause of this is the way that are implemented in Java.

In order to understand generics, a little bit of background is needed. The idea behind generic programming is that very generic algorithms are applied to data structures, and that it doesn't matter what type the internal data has. This of course contradicts conventional computer programming concepts in which every piece of data must have a type, and operations are only applied to the appropriate types, otherwise resulting in  compiler errors.

In order to bypass this restriction, a common meme in C programs was to use `void *` as a universal type, and then store an additional field that specified the actual runtime type of the data. In this way, type-safety was somewhat preserved, albeit only at runtime, and very much open to abuse. The problem with this approach can be symbolized by an `Object[]`. While you are free to place any type of data into such an array, there is no restriction that that type be consistent throughout the array. It is to provide this typing restriction that generics in Java, and templates in C++ were created.

So the folks who improve Java decided to include this feature into the language. But if they wanted to maintain backwards compatibility, they could only include generics using erasure. This effectively means that generics are only available as a compile time type, rather than a runtime type. The difference is subtle, but significant. More importantly, for my case, it is impossible to use a primitive type with generics. I'm not sure that I understand the reasoning behind this, but that's the way it is.

Now, what all this boils down to is that you can't use the Collections Framework in conjunction with primitive types (which is something I need for my project). While it may seem simple to say that I should simply pass these collections of reference types around, as opposed to arrays, there are several problems with this approach. First, while performance isn't exactly an important aspect of the project, unit testing is. And writing unit tests that use collections is a pain.

My current wishlist for Java:

1. Add `NOT_FOUND` to `String` & family

2. Allow generics to work with primitives. Even if this means breaking backwards compatibility. It would reduce the amount of weight of so many utility classes, and simplify so much code that the extra work fixing it would be worthwhile. And since it applies to a very specific subset of programming situations, it should be trivial to write a script to insert TODO tags everywhere it needs to be updated.
