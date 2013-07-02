---
title: Java Strings
layout: post
---
Recently, I've been developing a lot in Java. There are lots of people who say that it is a really slow language and it comes under fire a lot. But I've done some checking, and they've managed to pull off a lot of useful things extremely well through amazingly good design decisions. A great example of this is the way Java handles Strings.

While Java lacks the sheer awesomeness of string processing available from languages like PERL, it does have an extremely efficient implementation of Strings as a (quasi)primitive type. And the secret behind this efficiency: immutability. By simple virtue of Strings being immutable, there are many various optimizations we can put into place for dealing with any type of string processing. Such as only storing internal character buffers once (mandated by the Java standard). This means that all the following objects are backed by the same buffer:

{% highlight java %}
String first = "Hello, World";
String second = first.clone();
String third = "Hello, " + "world";
String fourth = new String("Hello, world");
String fifth = new String(third);
{% endhighlight %}

Pretty neat trick, right? But it gets better. If you dig a bit, it turns out that the JVM (not mandated by the standards, I think, but useful enough that it just gets done) will represent a substring as an actual subset of the internal character buffer. That means that these two objects share parts of their internal buffers:

{% highlight java %}
String first = "Good night, moon";
String second = first.substring(0, first.indexOf(" "));
{% endhighlight %}

Yep. That's right. Internally, the JVM holds a single character buffer, which first points to in its entirety, whereas second is only backed by a small subset of that buffer. It's times like these that I am reminded of the saying that adversity breeds innovation. It's entirely possible that Java has come up with designs such as this (and more) that are extremely efficient by simple virtue of the need for such efficiency.

Now that having been said, there is one thing that would make string processing in Java much easier to maintain:

1. A constant called `NOT_FOUND` as part of the `String`, `StringBuffer`, `StringBuilder`, and all similar classes. The good news is that this is a cosmetic change only, and in all likelyhood, no one outside an academic environment would ever use it, or even be aware of it.

'till next time!
