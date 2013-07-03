---
title: Strategies for Code Generation
layout: post
---
Code generation is often viewed as a mystic art that is very difficult to perform. In actuality, it's only slightly more complicated than any other templating problem. In many ways, it can even be simpler.

There are two types of code generation: dynamic and static. Dynamic generation is typically done during runtime, however the primary characteristic that defines it as dynamic is that the code is not intended for human consumption, or maintenance. Static generation, however, is not intended to be the final product that is packaged, but rather a starting point which can be customized and extended.

Static code generation has so much potential, it's not even funny. But the concept of a program writing code is so foreign and abstract that many novice programmers view it with a certain amount of awe and regard it as "magic code". In truth, static generators are often less complicated than most website code.

The trick is that instead of printing HTML, it prints Java, Ruby, or some other code. And because it's meant to be edited, it's perfect ok for the generated code to have a bug or two that need to be fixed by hand. Often, it's ideal to leave these areas to the user to fill in, by marking them with some sort of "TODO: fill in your code here" marker.

Of course, there are many issues with this, and these types of projects often result in unmaintainable messes that can't be used. So we end up using more dynamic-style generators that include the user code already in the source templates. In this way, we include the user input, and transform (compile) it into code that can be consumed by later and more low level processes.

Once we move away from the general concept of how to generate code, and when it should be generated, we find that there are some very specific cases where code generation is a good idea, since it cuts out a lot of the "tedium" of development.

- Parser/Lexer code. The problem is typically defined like this: given a grammer/expression, generate code that parses this into tokens, and applies some sort of transform to them. AntLR, yacc, etc. are all examples of code generators for this problem.
- Web Services. This is a somewhat debatable problem, since we usually build a parser/lexer that forwards requests to modules on top of the base service, but we can gain some rather significant performance by not using a general purpose web server and building a monolithic server instead.
- Build systems.

My experience with all of these problem domains has left me with the conclusion that a useful rule of thumb for code generation is that when you start copy & pasting code from one project to another as "Starter" code, you need to start using code generation instead.
