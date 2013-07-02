---
title: "State of the VM: Java"
layout: post
---
I've been working on a project for my Computer Networks class lately. We were tasked to build an RPC server in Java. I found the exercise extremely interesting, not in the least because I'm working on a project for work that has me building an application on top of an RPC framework in Java.

But back to the point. While building these projects, I needed a good logging system, and it was the first thing I set out to do. Now, if you're building a logging system, you want it to have all the frills. But at the same time, you also want to keep it simple, since complex, longer code has more bugs.

So I set out to create a simple, yet powerful log system. I managed to squeeze it into one class even (with two subclasses, but that's a technicality). The first hurdle I faced was how to support pretty print of POJOs so I can use the log class for debug prints. The answer was surprisingly simple, since almost all Java classes have a `toString`. But how to handle arrays? Turns out, there's a great utility class called `Arrays` that has `deepToString()` an `toString()` for every type of array imaginable. Then I sat down to write the code. How to seperate arrays from normal objects without writing mountains of methods? Simple, I'll use Reflection!

And that was when the trouble started. See, primitive arrays in Java aren't handled like Object arrays, and the typing system won't autobox arrays of primitives (understandably). Basically, it meant that I needed to write a massive if to check if the array (detected via Reflection) is an instanceof the various primitive arrays. Obviously, writing methods for each type is preferable, from an efficiency perspective, but when it comes to logging, typically speed is not a concern.

I'm not smart enough to think of a good solution to that problem, but the next one is just frustrating.

The first big milestone in the homework project is to implement the HTTP protocol. Not simple. Even less simple when you are given no guidance whatsoever about Unicode support. But it did help me realize something. I've been bitching and moaning here for a while and still haven't even gotten to my main point, which is that Java needs a major release, and soon. And when I say major release, I mean a major release that breaks backwards compatibility. This would afford the Java community to fix such black eyes as `System.out` being a `PrintStream` and not a `PrintWriter`.

As development moves onwards, more and more of the Java library becomes full of deprecated methods and classes, aimed only at maintaining backwards compatibility.

What I'm proposing will need to either break all existing java applications, or require a change in the packaging scheme of Java to include a major version number. It would be possible to pull off a concurrent release of Java where the current classes are maintained, but the default lang package for classes is changed to `java3.lang`.
